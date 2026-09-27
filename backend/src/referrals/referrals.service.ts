import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ReferralsService {
  constructor(private prisma: PrismaService) {}

  async getMyReferralData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { referralCode: true },
    });

    const referrals = await this.prisma.referralRecord.findMany({
      where: { referrerId: userId },
      include: {
        referee: { select: { id: true, fullName: true, avatarUrl: true, createdAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const ledger = await this.prisma.rewardLedger.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const totalEarned = ledger.reduce((sum, item) => sum + item.amount, 0);

    return {
      referralCode: user?.referralCode || 'HIMNOVA',
      referralLink: `https://learn.himnovatech.com/register?ref=${user?.referralCode}`,
      totalEarned,
      currency: 'NPR',
      referralsCount: referrals.length,
      referrals,
      ledger,
    };
  }

  async getAllReferralsForAdmin() {
    return this.prisma.referralRecord.findMany({
      include: {
        referrer: { select: { id: true, fullName: true, email: true, phoneNumber: true } },
        referee: { select: { id: true, fullName: true, email: true, phoneNumber: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: string, rewardAmount?: number) {
    const data: any = { status };
    if (rewardAmount !== undefined) {
      data.rewardAmount = rewardAmount;
    }
    return this.prisma.referralRecord.update({
      where: { id },
      data,
    });
  }

  async deleteReferral(id: string) {
    return this.prisma.referralRecord.delete({
      where: { id },
    });
  }
}
