import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async findAllForUser(user: { id: string; role: string }) {
    if (user.role === 'SUPER_ADMIN') {
      const assignments = await this.prisma.assignment.findMany({
        include: {
          lesson: {
            include: {
              module: {
                include: { course: true },
              },
            },
          },
          batch: true,
          _count: { select: { submissions: true } },
        },
        orderBy: { dueDate: 'desc' },
      });
      return assignments;
    }

    if (user.role === 'TRAINER') {
      // Find batches assigned to this trainer
      const trainerBatches = await this.prisma.batch.findMany({
        where: { trainerId: user.id },
        select: { id: true },
      });
      const batchIds = trainerBatches.map((b) => b.id);

      return this.prisma.assignment.findMany({
        where: {
          batchId: { in: batchIds },
        },
        include: {
          lesson: {
            include: {
              module: {
                include: { course: true },
              },
            },
          },
          batch: true,
          submissions: {
            include: {
              student: {
                select: { id: true, fullName: true, email: true, avatarUrl: true },
              },
            },
          },
          _count: { select: { submissions: true } },
        },
        orderBy: { dueDate: 'desc' },
      });
    }

    // Student: Get assignments for enrolled courses/batches with student submission status
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId: user.id },
      select: { courseId: true, batchId: true },
    });

    const courseIds = enrollments.map((e) => e.courseId);
    const batchIds = enrollments.map((e) => e.batchId).filter(Boolean) as string[];

    const assignments = await this.prisma.assignment.findMany({
      where: {
        OR: [
          { batchId: { in: batchIds } },
          { lesson: { module: { courseId: { in: courseIds } } } },
        ],
      },
      include: {
        lesson: {
          include: {
            module: {
              include: { course: true },
            },
          },
        },
        submissions: {
          where: { studentId: user.id },
          orderBy: { attemptNumber: 'desc' },
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    return assignments.map((a) => ({
      ...a,
      rubricCriteria: a.rubricCriteriaJson ? JSON.parse(a.rubricCriteriaJson) : [],
      mySubmission: a.submissions[0] || null,
    }));
  }

  async create(data: any, user: { id: string; role: string }) {
    if (user.role === 'TRAINER' && data.batchId) {
      const batch = await this.prisma.batch.findUnique({ where: { id: data.batchId } });
      if (!batch || batch.trainerId !== user.id) {
        throw new ForbiddenException('Cannot create assignment for a batch not assigned to you.');
      }
    }

    const assignment = await this.prisma.assignment.create({
      data: {
        lessonId: data.lessonId,
        batchId: data.batchId || null,
        title: data.title,
        instructions: data.instructions,
        dueDate: new Date(data.dueDate),
        maxScore: Number(data.maxScore) || 100,
        rubricCriteriaJson: data.rubricCriteria ? JSON.stringify(data.rubricCriteria) : null,
      },
    });

    return assignment;
  }
}
