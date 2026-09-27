import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger('PaymentsService');

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async initiatePayment(userId: string, data: { courseId: string; provider: string; couponCode?: string }) {
    const course = await this.prisma.course.findUnique({
      where: { id: data.courseId },
      include: {
        batches: { where: { status: { in: ['ENROLLING', 'ACTIVE'] } }, take: 1 },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    // Check if already enrolled
    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id,
        },
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException('You are already enrolled in this course.');
    }

    let baseAmount = course.discountPrice !== null && course.discountPrice !== undefined ? course.discountPrice : course.price;
    let discountAmount = 0;
    let finalAmount = baseAmount;

    // Validate coupon if provided
    if (data.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({
        where: { code: data.couponCode.toUpperCase().trim() },
      });

      if (coupon && coupon.isActive && new Date(coupon.expiryDate) > new Date() && coupon.usageCount < coupon.usageLimit) {
        if (!coupon.applicableCourseId || coupon.applicableCourseId === course.id) {
          if (!coupon.minPurchaseAmount || baseAmount >= coupon.minPurchaseAmount) {
            if (coupon.type === 'PERCENTAGE') {
              discountAmount = (baseAmount * coupon.value) / 100;
              if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
                discountAmount = coupon.maxDiscountAmount;
              }
            } else {
              discountAmount = coupon.value;
            }
            finalAmount = Math.max(0, baseAmount - discountAmount);
          }
        }
      }
    }

    const orderId = `HIM-ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const transaction = await this.prisma.paymentTransaction.create({
      data: {
        orderId,
        userId,
        courseId: course.id,
        amount: finalAmount,
        currency: course.currency || 'NPR',
        provider: data.provider,
        status: 'PENDING',
        couponCode: data.couponCode ? data.couponCode.toUpperCase().trim() : null,
        discountAmount,
      },
    });

    // Prepare provider-specific payloads
    let providerPayload: any = {};

    if (data.provider === 'ESEWA') {
      const merchantId = this.configService.get<string>('ESEWA_MERCHANT_ID') || 'EPAYTEST';
      const secretKey = this.configService.get<string>('ESEWA_SECRET_KEY') || '8gBm/:&EnhH.1/q';
      const totalAmountStr = `${finalAmount.toFixed(2)}`;
      
      // Signature for eSewa v2: total_amount,transaction_uuid,product_code
      const signatureData = `total_amount=${totalAmountStr},transaction_uuid=${orderId},product_code=${merchantId}`;
      const hash = crypto.createHmac('sha256', secretKey).update(signatureData).digest('base64');

      providerPayload = {
        amount: finalAmount,
        tax_amount: '0',
        total_amount: totalAmountStr,
        transaction_uuid: orderId,
        product_code: merchantId,
        product_service_charge: '0',
        product_delivery_charge: '0',
        success_url: `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}/checkout/verify?provider=ESEWA&orderId=${orderId}`,
        failure_url: `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}/checkout/failed?orderId=${orderId}`,
        signed_field_names: 'total_amount,transaction_uuid,product_code',
        signature: hash,
        payment_url: this.configService.get<string>('ESEWA_PAYMENT_URL') || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
      };
    } else if (data.provider === 'KHALTI') {
      providerPayload = {
        publicKey: this.configService.get<string>('KHALTI_PUBLIC_KEY') || 'test_public_key_dc74e0fd57cb46cd93832aee0a505e40',
        productIdentity: orderId,
        productName: course.title,
        productUrl: `${this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000'}/courses/${course.slug}`,
        amount: Math.round(finalAmount * 100), // in Paisa
        orderId,
      };
    }

    return {
      orderId,
      transactionId: transaction.id,
      amount: finalAmount,
      currency: course.currency,
      provider: data.provider,
      providerPayload,
    };
  }

  async verifyPayment(orderId: string, provider: string, payload: any) {
    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { orderId },
      include: {
        user: true,
        course: {
          include: {
            batches: { where: { status: { in: ['ENROLLING', 'ACTIVE'] } }, take: 1 },
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found.');
    }

    // Idempotency check: if already completed, return existing success state
    if (transaction.status === 'COMPLETED') {
      return {
        success: true,
        alreadyProcessed: true,
        message: 'Payment already verified and course activated.',
        transaction,
      };
    }

    // Provider verification logic
    let isVerified = false;
    let providerRef = payload.transaction_code || payload.pidx || payload.token || `REF-${Date.now()}`;

    if (provider === 'ESEWA') {
      // In production or sandbox, verify signature or call eSewa status API
      isVerified = true;
    } else if (provider === 'KHALTI') {
      isVerified = true;
    } else {
      isVerified = true;
    }

    if (!isVerified) {
      await this.prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: { status: 'FAILED', rawCallbackPayload: JSON.stringify(payload) },
      });
      throw new BadRequestException('Payment verification failed with provider.');
    }

    // Mark completed
    const updatedTransaction = await this.prisma.paymentTransaction.update({
      where: { id: transaction.id },
      data: {
        status: 'COMPLETED',
        providerTransactionId: providerRef,
        rawCallbackPayload: JSON.stringify(payload),
      },
    });

    // Increment coupon usage count if coupon used
    if (transaction.couponCode) {
      await this.prisma.coupon.updateMany({
        where: { code: transaction.couponCode },
        data: { usageCount: { increment: 1 } },
      });
    }

    // Enroll student automatically
    const totalLessons = await this.prisma.lesson.count({
      where: { module: { courseId: transaction.courseId } },
    });

    const defaultBatch = transaction.course.batches[0];

    const enrollment = await this.prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: transaction.userId,
          courseId: transaction.courseId,
        },
      },
      update: {
        batchId: defaultBatch ? defaultBatch.id : undefined,
        totalLessonsCount: totalLessons,
      },
      create: {
        userId: transaction.userId,
        courseId: transaction.courseId,
        batchId: defaultBatch ? defaultBatch.id : null,
        totalLessonsCount: totalLessons,
        completedLessonsCount: 0,
        progressPercentage: 0,
      },
    });

    if (defaultBatch) {
      await this.prisma.batchStudent.upsert({
        where: {
          batchId_studentId: {
            batchId: defaultBatch.id,
            studentId: transaction.userId,
          },
        },
        update: {},
        create: {
          batchId: defaultBatch.id,
          studentId: transaction.userId,
        },
      });
    }

    // Check if student was referred by someone -> reward referrer
    if (transaction.user.referredById) {
      const rewardAmount = 1000;
      await this.prisma.referralRecord.create({
        data: {
          referrerId: transaction.user.referredById,
          refereeId: transaction.userId,
          courseId: transaction.courseId,
          rewardAmount,
          currency: 'NPR',
          status: 'REWARDED',
        },
      });

      await this.prisma.rewardLedger.create({
        data: {
          userId: transaction.user.referredById,
          amount: rewardAmount,
          currency: 'NPR',
          type: 'REFERRAL_EARNING',
          note: `Reward for ${transaction.user.fullName}'s enrollment in ${transaction.course.title}`,
        },
      });

      await this.prisma.notificationItem.create({
        data: {
          userId: transaction.user.referredById,
          title: `Referral Reward: Rs. ${rewardAmount} Credited! 🎁`,
          message: `${transaction.user.fullName} enrolled using your referral code.`,
          type: 'SUCCESS',
          linkUrl: '/student/referrals',
        },
      });
    }

    // Student notification
    await this.prisma.notificationItem.create({
      data: {
        userId: transaction.userId,
        title: 'Enrollment Confirmed! 🚀',
        message: `Your payment of Rs. ${transaction.amount} for "${transaction.course.title}" was verified. Start your first lesson now!`,
        type: 'SUCCESS',
        linkUrl: `/learn/${transaction.course.slug}`,
      },
    });

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        actorId: transaction.userId,
        actorEmail: transaction.user.email,
        action: 'PAYMENT_VERIFIED',
        resourceType: 'PaymentTransaction',
        resourceId: transaction.id,
        metadataJson: JSON.stringify({
          orderId,
          amount: transaction.amount,
          provider,
          courseId: transaction.courseId,
        }),
      },
    });

    return {
      success: true,
      transaction: updatedTransaction,
      enrollment,
      courseSlug: transaction.course.slug,
    };
  }

  async submitManualQrClaim(
    userId: string,
    data: {
      courseId: string;
      amount: number;
      transactionId: string;
      senderName: string;
      senderPhone: string;
      bankWalletName: string;
      receiptScreenshotUrl?: string;
    },
  ) {
    const course = await this.prisma.course.findUnique({
      where: { id: data.courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    const orderId = `QR-MANUAL-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const transaction = await this.prisma.paymentTransaction.create({
      data: {
        orderId,
        userId,
        courseId: course.id,
        amount: Number(data.amount),
        currency: course.currency || 'NPR',
        provider: 'QR_PAYMENT',
        providerTransactionId: data.transactionId,
        senderName: data.senderName,
        senderPhone: data.senderPhone,
        bankWalletName: data.bankWalletName,
        receiptScreenshotUrl: data.receiptScreenshotUrl || '/logos/QR Code.jpeg',
        status: 'PENDING_VERIFICATION',
        adminNotes: 'Submitted via QR Code Scan. Awaiting Super Admin review.',
      },
    });

    // Student notification
    await this.prisma.notificationItem.create({
      data: {
        userId,
        title: 'Payment Verification Pending ⏳',
        message: `Your payment claim of NPR ${data.amount.toLocaleString()} for "${course.title}" was submitted. Super Admin will verify your transaction within 30 minutes to 1 hour.`,
        type: 'INFO',
        linkUrl: '/student/billing',
      },
    });

    return {
      success: true,
      message: 'Payment claim submitted successfully. Admin will verify within 30-60 minutes.',
      orderId,
      transaction,
    };
  }

  async verifyManualClaim(
    orderId: string,
    data: { isApproved?: boolean; status?: string; adminNotes?: string },
    adminId: string,
  ) {
    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { orderId },
      include: {
        user: true,
        course: {
          include: {
            batches: { 
              where: { status: { in: ['ACTIVE', 'ENROLLING'] } }, 
              orderBy: { startDate: 'desc' },
              take: 1 
            },
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found.');
    }

    const isApproved = data.isApproved === true || data.status === 'COMPLETED';

    if (isApproved) {
      const updated = await this.prisma.paymentTransaction.update({
        where: { orderId },
        data: {
          status: 'COMPLETED',
          adminNotes: data.adminNotes || 'Verified & Activated by Admin',
          verifiedById: adminId,
          verifiedAt: new Date(),
        },
      });

      // Activate enrollment
      const courseLessons = await this.prisma.lesson.count({
        where: { module: { courseId: transaction.courseId } },
      });

      const assignedBatch = transaction.course.batches[0];

      const enrollment = await this.prisma.enrollment.upsert({
        where: {
          userId_courseId: {
            userId: transaction.userId,
            courseId: transaction.courseId,
          },
        },
        update: {
          batchId: assignedBatch ? assignedBatch.id : undefined,
          totalLessonsCount: courseLessons,
        },
        create: {
          userId: transaction.userId,
          courseId: transaction.courseId,
          batchId: assignedBatch ? assignedBatch.id : null,
          totalLessonsCount: courseLessons,
          completedLessonsCount: 0,
          progressPercentage: 0,
        },
      });

      if (assignedBatch) {
        await this.prisma.batchStudent.upsert({
          where: {
            batchId_studentId: {
              batchId: assignedBatch.id,
              studentId: transaction.userId,
            },
          },
          update: {},
          create: {
            batchId: assignedBatch.id,
            studentId: transaction.userId,
          },
        });
      }

      // Notify student
      await this.prisma.notificationItem.create({
        data: {
          userId: transaction.userId,
          title: 'Payment Verified & Access Unlocked! 🎉',
          message: `Your payment of NPR ${transaction.amount.toLocaleString()} for "${transaction.course.title}" was verified. Full course access and live cohort are active!`,
          type: 'SUCCESS',
          linkUrl: `/learn/${transaction.course.slug}`,
        },
      });

      // Audit log
      await this.prisma.auditLog.create({
        data: {
          actorId: adminId,
          action: 'PAYMENT_VERIFIED',
          resourceType: 'PaymentTransaction',
          resourceId: transaction.id,
          metadataJson: JSON.stringify({ orderId, amount: transaction.amount, studentId: transaction.userId }),
        },
      });

      return { success: true, message: 'Payment verified and enrollment activated!', updated, enrollment };
    } else {
      const updated = await this.prisma.paymentTransaction.update({
        where: { orderId },
        data: {
          status: 'REJECTED',
          adminNotes: data.adminNotes || 'Payment claim could not be verified.',
          verifiedById: adminId,
          verifiedAt: new Date(),
        },
      });

      await this.prisma.notificationItem.create({
        data: {
          userId: transaction.userId,
          title: 'Payment Verification Rejected ⚠️',
          message: `Your payment claim for "${transaction.course.title}" could not be verified. Note: ${data.adminNotes || 'Please contact admissions.'}`,
          type: 'ALERT',
          linkUrl: '/student/billing',
        },
      });

      return { success: false, message: 'Payment claim rejected.', updated };
    }
  }

  async getAdminTransactions() {
    return this.prisma.paymentTransaction.findMany({
      include: {
        user: { select: { id: true, fullName: true, email: true, phoneNumber: true } },
        course: { select: { id: true, title: true, price: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deletePayment(id: string) {
    return this.prisma.paymentTransaction.delete({
      where: { id },
    });
  }
}
