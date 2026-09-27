import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async getMyEnrollments(userId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: {
                  select: { id: true, title: true, type: true, durationMinutes: true },
                },
              },
            },
          },
        },
        batch: {
          include: {
            trainer: {
              select: { id: true, fullName: true, avatarUrl: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return enrollments;
  }

  async getAllEnrollments(query?: { courseId?: string; batchId?: string; search?: string }) {
    const where: any = {};
    if (query?.courseId) where.courseId = query.courseId;
    if (query?.batchId) where.batchId = query.batchId;
    if (query?.search) {
      where.user = {
        OR: [
          { fullName: { contains: query.search } },
          { email: { contains: query.search } },
        ],
      };
    }

    return this.prisma.enrollment.findMany({
      where,
      include: {
        user: {
          select: { id: true, fullName: true, email: true, avatarUrl: true, phoneNumber: true },
        },
        course: {
          select: { id: true, title: true, slug: true, category: true },
        },
        batch: {
          select: { id: true, name: true, code: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async enrollStudentDirectly(
    userId: string,
    courseId: string,
    batchId?: string,
    adminId?: string
  ) {
    const courseLessons = await this.prisma.lesson.count({
      where: { module: { courseId } },
    });

    const enrollment = await this.prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      update: {
        batchId: batchId || undefined,
        totalLessonsCount: courseLessons,
      },
      create: {
        userId,
        courseId,
        batchId: batchId || null,
        totalLessonsCount: courseLessons,
        completedLessonsCount: 0,
        progressPercentage: 0,
      },
    });

    if (batchId) {
      await this.prisma.batchStudent.upsert({
        where: {
          batchId_studentId: {
            batchId,
            studentId: userId,
          },
        },
        update: {},
        create: {
          batchId,
          studentId: userId,
        },
      });
    }

    if (adminId) {
      await this.prisma.auditLog.create({
        data: {
          actorId: adminId,
          action: 'STUDENT_ENROLLED',
          resourceType: 'Enrollment',
          resourceId: enrollment.id,
          metadataJson: JSON.stringify({ userId, courseId, batchId }),
        },
      });
    }

    return enrollment;
  }
}
