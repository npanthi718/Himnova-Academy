import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class LiveClassesService {
  constructor(private prisma: PrismaService) {}

  async getMyLiveClasses(user: { id: string; role: string }) {
    if (user.role === 'SUPER_ADMIN') {
      return this.prisma.liveClass.findMany({
        include: {
          batch: { include: { course: true } },
          trainer: { select: { id: true, fullName: true, avatarUrl: true } },
        },
        orderBy: { startTime: 'asc' },
      });
    }

    if (user.role === 'TRAINER') {
      return this.prisma.liveClass.findMany({
        where: { trainerId: user.id },
        include: {
          batch: { include: { course: true } },
        },
        orderBy: { startTime: 'asc' },
      });
    }

    // Student: Only live classes for enrolled batches
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId: user.id },
      select: { batchId: true },
    });

    const batchIds = enrollments.map((e) => e.batchId).filter(Boolean) as string[];

    return this.prisma.liveClass.findMany({
      where: {
        batchId: { in: batchIds },
      },
      include: {
        batch: { include: { course: true } },
        trainer: { select: { id: true, fullName: true, avatarUrl: true } },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async createLiveClass(data: any, user: { id: string; role: string }) {
    if (user.role === 'TRAINER') {
      const batch = await this.prisma.batch.findUnique({ where: { id: data.batchId } });
      if (!batch || batch.trainerId !== user.id) {
        throw new ForbiddenException('Cannot schedule live class for a batch you do not teach.');
      }
    }

    const liveClass = await this.prisma.liveClass.create({
      data: {
        batchId: data.batchId,
        trainerId: user.id,
        title: data.title,
        description: data.description || null,
        provider: data.provider || 'ZOOM',
        meetingUrl: data.meetingUrl,
        meetingId: data.meetingId || null,
        meetingPassword: data.meetingPassword || null,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
      },
    });

    return liveClass;
  }
}
