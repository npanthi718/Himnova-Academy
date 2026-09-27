import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class BatchesService {
  constructor(private prisma: PrismaService) {}

  async findAll(user: { id: string; role: string }) {
    const where: any = {};
    // If Trainer, restrict strictly to batches assigned to this trainer
    if (user.role === 'TRAINER') {
      where.trainerId = user.id;
    }

    const batches = await this.prisma.batch.findMany({
      where,
      include: {
        course: {
          select: { id: true, title: true, slug: true, category: true },
        },
        trainer: {
          select: { id: true, fullName: true, email: true, avatarUrl: true },
        },
        students: {
          include: {
            student: {
              select: { id: true, fullName: true, email: true, avatarUrl: true, phoneNumber: true },
            },
          },
        },
        _count: {
          select: {
            students: true,
            assignments: true,
            liveClasses: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    return batches;
  }

  async findOne(id: string, user: { id: string; role: string }) {
    const batch = await this.prisma.batch.findUnique({
      where: { id },
      include: {
        course: true,
        trainer: {
          select: { id: true, fullName: true, email: true, avatarUrl: true, bio: true },
        },
        students: {
          include: {
            student: {
              select: {
                id: true,
                fullName: true,
                email: true,
                avatarUrl: true,
                phoneNumber: true,
              },
            },
          },
        },
        assignments: {
          include: {
            _count: { select: { submissions: true } },
          },
        },
        liveClasses: {
          orderBy: { startTime: 'asc' },
        },
      },
    });

    if (!batch) {
      throw new NotFoundException('Batch not found.');
    }

    if (user.role === 'TRAINER' && batch.trainerId !== user.id) {
      throw new ForbiddenException({
        code: 'UNAUTHORIZED_BATCH_ACCESS',
        message: 'You are not authorized to view or manage batches assigned to another trainer.',
      });
    }

    return batch;
  }

  async create(data: any, adminId: string) {
    const batch = await this.prisma.batch.create({
      data: {
        courseId: data.courseId,
        trainerId: data.trainerId || null,
        name: data.name,
        code: data.code,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        maxStudents: Number(data.maxStudents) || 30,
        status: data.status || 'ENROLLING',
        scheduleDays: data.scheduleDays || null,
        classTiming: data.classTiming || null,
        totalHours: data.totalHours ? Number(data.totalHours) : 75,
        meetingUrl: data.meetingUrl || null,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: 'BATCH_CREATED',
        resourceType: 'Batch',
        resourceId: batch.id,
        metadataJson: JSON.stringify({ name: batch.name, code: batch.code }),
      },
    });

    return batch;
  }

  async update(id: string, data: any, user: { id: string; role: string }) {
    const existing = await this.prisma.batch.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Batch not found.');

    if (user.role === 'TRAINER' && existing.trainerId !== user.id) {
      throw new ForbiddenException('Cannot modify another trainer batch.');
    }

    return this.prisma.batch.update({
      where: { id },
      data: {
        name: data.name,
        code: data.code,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        maxStudents: data.maxStudents ? Number(data.maxStudents) : undefined,
        status: data.status !== undefined ? data.status : undefined,
        trainerId: data.trainerId !== undefined ? data.trainerId : undefined,
        scheduleDays: data.scheduleDays !== undefined ? data.scheduleDays : undefined,
        classTiming: data.classTiming !== undefined ? data.classTiming : undefined,
        totalHours: data.totalHours !== undefined ? (data.totalHours ? Number(data.totalHours) : null) : undefined,
        meetingUrl: data.meetingUrl !== undefined ? data.meetingUrl : undefined,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.batch.delete({
      where: { id },
    });
  }
}
