import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async validateCoupon(code: string, courseId?: string, amount?: number) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!coupon) {
      throw new NotFoundException({
        code: 'INVALID_COUPON',
        message: 'The coupon code entered does not exist.',
      });
    }

    if (!coupon.isActive) {
      throw new BadRequestException('This coupon has been disabled.');
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      throw new BadRequestException('This coupon code has expired.');
    }

    if (coupon.usageCount >= coupon.usageLimit) {
      throw new BadRequestException('This coupon has reached its maximum usage limit.');
    }

    if (coupon.applicableCourseId && courseId && coupon.applicableCourseId !== courseId) {
      throw new BadRequestException('This coupon is not valid for the selected course.');
    }

    if (amount && coupon.minPurchaseAmount && amount < coupon.minPurchaseAmount) {
      throw new BadRequestException(`Minimum cart value of Rs. ${coupon.minPurchaseAmount} is required for this coupon.`);
    }

    let discount = 0;
    if (amount) {
      if (coupon.type === 'PERCENTAGE') {
        discount = (amount * coupon.value) / 100;
        if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
          discount = coupon.maxDiscountAmount;
        }
      } else {
        discount = coupon.value;
      }
    }

    return {
      valid: true,
      coupon,
      estimatedDiscount: discount,
    };
  }

  async create(data: any) {
    return this.prisma.coupon.create({
      data: {
        code: data.code.toUpperCase().trim(),
        type: data.type || 'PERCENTAGE',
        value: Number(data.value),
        minPurchaseAmount: data.minPurchaseAmount ? Number(data.minPurchaseAmount) : 0,
        maxDiscountAmount: data.maxDiscountAmount ? Number(data.maxDiscountAmount) : null,
        expiryDate: new Date(data.expiryDate),
        usageLimit: Number(data.usageLimit) || 100,
        applicableCourseId: data.applicableCourseId || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
  }

  async update(id: string, data: any) {
    const updateData: any = {};
    if (data.code) updateData.code = data.code.toUpperCase().trim();
    if (data.type) updateData.type = data.type;
    if (data.value !== undefined) updateData.value = Number(data.value);
    if (data.minPurchaseAmount !== undefined) updateData.minPurchaseAmount = Number(data.minPurchaseAmount);
    if (data.maxDiscountAmount !== undefined) updateData.maxDiscountAmount = data.maxDiscountAmount ? Number(data.maxDiscountAmount) : null;
    if (data.expiryDate) updateData.expiryDate = new Date(data.expiryDate);
    if (data.usageLimit !== undefined) updateData.usageLimit = Number(data.usageLimit);
    if (data.applicableCourseId !== undefined) updateData.applicableCourseId = data.applicableCourseId || null;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    return this.prisma.coupon.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    return this.prisma.coupon.delete({
      where: { id },
    });
  }
}
