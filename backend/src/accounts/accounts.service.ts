import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  // -------------------------------------------------------------
  // Summary & Ledger
  // -------------------------------------------------------------
  async getFinancialOverview() {
    const payments = await this.prisma.paymentTransaction.findMany({
      where: { status: 'COMPLETED' },
    });
    const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);

    const expenses = await this.prisma.expenseRecord.findMany();
    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

    const payouts = await this.prisma.trainerPayout.findMany();
    const totalPayoutsPaid = payouts.filter(p => p.status === 'PAID').reduce((acc, p) => acc + p.amount, 0);
    const totalPayoutsPending = payouts.filter(p => p.status === 'PENDING').reduce((acc, p) => acc + p.amount, 0);

    const netProfit = totalRevenue - totalExpenses - totalPayoutsPaid;

    return {
      totalRevenue,
      totalExpenses,
      totalPayoutsPaid,
      totalPayoutsPending,
      netProfit,
      currency: 'NPR',
      completedTransactionsCount: payments.length,
      expensesCount: expenses.length,
      payoutsCount: payouts.length,
    };
  }

  // -------------------------------------------------------------
  // Expenses CRUD
  // -------------------------------------------------------------
  async getExpenses(category?: string) {
    const where: any = {};
    if (category) where.category = category;
    return this.prisma.expenseRecord.findMany({
      where,
      include: {
        createdBy: {
          select: { id: true, fullName: true, email: true },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async createExpense(
    data: {
      category: string;
      title: string;
      amount: number;
      date?: string;
      receiptUrl?: string;
      notes?: string;
    },
    adminId: string,
  ) {
    const expense = await this.prisma.expenseRecord.create({
      data: {
        category: data.category,
        title: data.title,
        amount: Number(data.amount),
        date: data.date ? new Date(data.date) : new Date(),
        receiptUrl: data.receiptUrl || null,
        notes: data.notes || null,
        createdById: adminId,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: 'EXPENSE_RECORDED',
        resourceType: 'ExpenseRecord',
        resourceId: expense.id,
        metadataJson: JSON.stringify({ title: expense.title, amount: expense.amount }),
      },
    });

    return expense;
  }

  async deleteExpense(id: string, adminId: string) {
    const res = await this.prisma.expenseRecord.delete({ where: { id } });
    await this.prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: 'EXPENSE_DELETED',
        resourceType: 'ExpenseRecord',
        resourceId: id,
      },
    });
    return res;
  }

  // -------------------------------------------------------------
  // Trainer Payouts
  // -------------------------------------------------------------
  async getTrainerPayouts(trainerId?: string) {
    const where: any = {};
    if (trainerId) where.trainerId = trainerId;

    return this.prisma.trainerPayout.findMany({
      where,
      include: {
        trainer: {
          select: { id: true, fullName: true, email: true, phoneNumber: true, payoutAccount: true },
        },
        batch: {
          select: { id: true, name: true, code: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTrainerPayout(
    data: {
      trainerId: string;
      batchId?: string;
      amount: number;
      classesCount?: number;
      paymentMethod?: string;
      accountDetails?: string;
      referenceId?: string;
      status?: string;
      notes?: string;
    },
    adminId: string,
  ) {
    const isPaid = data.status === 'PAID';
    const payout = await this.prisma.trainerPayout.create({
      data: {
        trainerId: data.trainerId,
        batchId: data.batchId || null,
        amount: Number(data.amount),
        classesCount: Number(data.classesCount || 0),
        paymentMethod: data.paymentMethod || 'BANK_TRANSFER',
        accountDetails: data.accountDetails || null,
        referenceId: data.referenceId || null,
        status: data.status || 'PENDING',
        paidAt: isPaid ? new Date() : null,
        notes: data.notes || null,
        createdById: adminId,
      },
    });

    await this.prisma.notificationItem.create({
      data: {
        userId: data.trainerId,
        title: isPaid ? 'Trainer Payout Processed (Rs. ' + data.amount.toLocaleString() + ')' : 'New Payout Initiated',
        message: isPaid 
          ? `Your teaching stipend of NPR ${data.amount.toLocaleString()} has been transferred via ${data.paymentMethod || 'Bank Transfer'}. Reference: ${data.referenceId || 'N/A'}`
          : `A payout record of NPR ${data.amount.toLocaleString()} has been scheduled for your batches.`,
        type: 'SUCCESS',
        linkUrl: '/trainer/earnings',
      },
    });

    return payout;
  }

  async updatePayoutStatus(id: string, status: string, referenceId?: string, adminId?: string) {
    const isPaid = status === 'PAID';
    const payout = await this.prisma.trainerPayout.update({
      where: { id },
      data: {
        status,
        referenceId: referenceId || undefined,
        paidAt: isPaid ? new Date() : undefined,
      },
    });

    if (isPaid) {
      await this.prisma.notificationItem.create({
        data: {
          userId: payout.trainerId,
          title: 'Trainer Payout Completed (Rs. ' + payout.amount.toLocaleString() + ')',
          message: `Your payment has been successfully cleared. Reference: ${referenceId || payout.referenceId || 'Bank Transfer'}`,
          type: 'SUCCESS',
          linkUrl: '/trainer/earnings',
        },
      });
    }

    return payout;
  }

  async getMyTrainerEarnings(trainerId: string) {
    const payouts = await this.prisma.trainerPayout.findMany({
      where: { trainerId },
      include: {
        batch: { select: { name: true, code: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalPaid = payouts.filter(p => p.status === 'PAID').reduce((acc, p) => acc + p.amount, 0);
    const totalPending = payouts.filter(p => p.status === 'PENDING').reduce((acc, p) => acc + p.amount, 0);
    const classesTaught = await this.prisma.liveClass.count({
      where: { trainerId, isCompleted: true },
    });

    return {
      totalPaid,
      totalPending,
      classesTaught,
      payouts,
    };
  }

  async deleteTrainerPayout(id: string) {
    return this.prisma.trainerPayout.delete({
      where: { id },
    });
  }
}
