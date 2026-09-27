import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SubmissionsService {
  constructor(private prisma: PrismaService) {}

  async submitAssignment(studentId: string, data: any) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: data.assignmentId },
      include: {
        lesson: {
          include: { module: true },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found.');
    }

    // Check if previous attempt exists
    const lastAttempt = await this.prisma.assignmentSubmission.findFirst({
      where: {
        assignmentId: data.assignmentId,
        studentId,
      },
      orderBy: { attemptNumber: 'desc' },
    });

    const attemptNumber = lastAttempt ? lastAttempt.attemptNumber + 1 : 1;

    const submission = await this.prisma.assignmentSubmission.create({
      data: {
        assignmentId: data.assignmentId,
        studentId,
        submissionText: data.submissionText || null,
        fileUrl: data.fileUrl || null,
        githubUrl: data.githubUrl || null,
        liveDemoUrl: data.liveDemoUrl || null,
        status: 'SUBMITTED',
        attemptNumber,
      },
    });

    // Notify student that submission is received
    await this.prisma.notificationItem.create({
      data: {
        userId: studentId,
        title: 'Assignment Submitted Successfully',
        message: `Your submission for "${assignment.title}" (Attempt #${attemptNumber}) has been submitted for trainer review.`,
        type: 'SUCCESS',
        linkUrl: '/student/assignments',
      },
    });

    return submission;
  }

  async getSubmissionsForTrainer(trainerId: string, role: string) {
    if (role === 'SUPER_ADMIN') {
      return this.prisma.assignmentSubmission.findMany({
        include: {
          assignment: {
            include: {
              lesson: {
                include: { module: { include: { course: true } } },
              },
            },
          },
          student: {
            select: { id: true, fullName: true, email: true, avatarUrl: true },
          },
        },
        orderBy: { submittedAt: 'desc' },
      });
    }

    // Trainer: Only submissions for batches assigned to this trainer
    const trainerBatches = await this.prisma.batch.findMany({
      where: { trainerId },
      select: { id: true },
    });
    const batchIds = trainerBatches.map((b) => b.id);

    return this.prisma.assignmentSubmission.findMany({
      where: {
        assignment: {
          batchId: { in: batchIds },
        },
      },
      include: {
        assignment: {
          include: {
            lesson: {
              include: { module: { include: { course: true } } },
            },
          },
        },
        student: {
          select: { id: true, fullName: true, email: true, avatarUrl: true },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async gradeSubmission(
    submissionId: string,
    trainerId: string,
    data: { score: number; feedback: string; status: string }
  ) {
    const submission = await this.prisma.assignmentSubmission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: true,
        student: true,
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found.');
    }

    const updated = await this.prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        score: Number(data.score),
        trainerFeedback: data.feedback,
        status: data.status,
        reviewedById: trainerId,
        reviewedAt: new Date(),
      },
    });

    // Notify student
    await this.prisma.notificationItem.create({
      data: {
        userId: submission.studentId,
        title: `Assignment ${data.status === 'APPROVED' ? 'Approved' : 'Reviewed'}: ${data.score}/${submission.assignment.maxScore}`,
        message: `Trainer reviewed "${submission.assignment.title}": ${data.feedback.slice(0, 120)}...`,
        type: data.status === 'APPROVED' ? 'SUCCESS' : 'INFO',
        linkUrl: '/student/assignments',
      },
    });

    return updated;
  }
}
