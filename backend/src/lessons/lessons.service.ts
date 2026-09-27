import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async getLessonContent(lessonId: string, user: { id: string; role: string }) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true,
          },
        },
        resources: true,
        quizQuestions: true,
        assignments: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found.');
    }

    const courseId = lesson.module.courseId;

    // Authorization checks:
    // 1. Super Admin: full access
    if (user.role === 'SUPER_ADMIN') {
      return this.formatLessonPayload(lesson, user.id);
    }

    // 2. Free preview: public/student access allowed
    if (lesson.isFreePreview) {
      return this.formatLessonPayload(lesson, user.id);
    }

    // 3. Trainer check: Must be assigned to a batch of this course
    if (user.role === 'TRAINER') {
      const isAssigned = await this.prisma.batch.findFirst({
        where: {
          courseId,
          trainerId: user.id,
        },
      });
      if (!isAssigned) {
        throw new ForbiddenException({
          code: 'TRAINER_NOT_ASSIGNED',
          message: 'You are not assigned as a trainer to this course.',
        });
      }
      return this.formatLessonPayload(lesson, user.id);
    }

    // 4. Student check: Must be enrolled in this course
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });

    if (!enrollment) {
      throw new ForbiddenException({
        code: 'ENROLLMENT_REQUIRED',
        message: 'You must be enrolled in this course to access this lesson and its private resources.',
      });
    }

    return this.formatLessonPayload(lesson, user.id);
  }

  private async formatLessonPayload(lesson: any, userId: string) {
    // Get user progress for this lesson
    const progress = await this.prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId: lesson.id,
        },
      },
    });

    return {
      ...lesson,
      quizQuestions: lesson.quizQuestions.map((q: any) => ({
        ...q,
        options: q.optionsJson ? JSON.parse(q.optionsJson) : [],
      })),
      userProgress: progress || { isCompleted: false, lastPositionSeconds: 0 },
    };
  }

  async updateProgress(
    lessonId: string,
    userId: string,
    data: { isCompleted?: boolean; lastPositionSeconds?: number }
  ) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found.');
    }

    const progress = await this.prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        isCompleted: data.isCompleted !== undefined ? data.isCompleted : undefined,
        lastPositionSeconds: data.lastPositionSeconds !== undefined ? data.lastPositionSeconds : undefined,
        completedAt: data.isCompleted ? new Date() : undefined,
      },
      create: {
        userId,
        lessonId,
        isCompleted: data.isCompleted || false,
        lastPositionSeconds: data.lastPositionSeconds || 0,
        completedAt: data.isCompleted ? new Date() : null,
      },
    });

    // Recompute total course progress for this user
    const courseId = lesson.module.courseId;
    const allCourseLessons = await this.prisma.lesson.findMany({
      where: { module: { courseId } },
      select: { id: true },
    });

    const totalLessons = allCourseLessons.length;
    const completedProgresses = await this.prisma.lessonProgress.count({
      where: {
        userId,
        lessonId: { in: allCourseLessons.map((l) => l.id) },
        isCompleted: true,
      },
    });

    const percentage = totalLessons > 0 ? (completedProgresses / totalLessons) * 100 : 0;
    const isCourseCompleted = percentage >= 100;

    await this.prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      update: {
        completedLessonsCount: completedProgresses,
        totalLessonsCount: totalLessons,
        progressPercentage: Number(percentage.toFixed(1)),
        isCompleted: isCourseCompleted,
        completedAt: isCourseCompleted ? new Date() : undefined,
      },
      create: {
        userId,
        courseId,
        completedLessonsCount: completedProgresses,
        totalLessonsCount: totalLessons,
        progressPercentage: Number(percentage.toFixed(1)),
        isCompleted: isCourseCompleted,
      },
    });

    return { progress, percentage, isCourseCompleted };
  }

  async createLesson(data: {
    moduleId: string;
    title: string;
    description?: string;
    type?: string;
    contentMarkdown?: string;
    videoUrl?: string;
    slideUrl?: string;
    pdfUrl?: string;
    externalUrl?: string;
    durationMinutes?: number;
    isFreePreview?: boolean;
    orderIndex?: number;
  }, user: { id: string; role: string }) {
    const module = await this.prisma.courseModule.findUnique({
      where: { id: data.moduleId },
    });
    if (!module) throw new NotFoundException('Course module not found.');

    const lessonCount = await this.prisma.lesson.count({ where: { moduleId: data.moduleId } });

    const lesson = await this.prisma.lesson.create({
      data: {
        moduleId: data.moduleId,
        title: data.title.trim(),
        description: data.description || null,
        type: data.type || 'VIDEO',
        contentMarkdown: data.contentMarkdown || null,
        videoUrl: data.videoUrl || null,
        slideUrl: data.slideUrl || null,
        pdfUrl: data.pdfUrl || null,
        externalUrl: data.externalUrl || null,
        durationMinutes: data.durationMinutes ? Number(data.durationMinutes) : 20,
        isFreePreview: Boolean(data.isFreePreview),
        orderIndex: data.orderIndex !== undefined ? Number(data.orderIndex) : lessonCount + 1,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'LESSON_CREATED',
        resourceType: 'Lesson',
        resourceId: lesson.id,
        metadataJson: JSON.stringify({ title: lesson.title, type: lesson.type }),
      },
    });

    return lesson;
  }

  async updateLesson(id: string, data: {
    title?: string;
    description?: string;
    type?: string;
    contentMarkdown?: string;
    videoUrl?: string;
    slideUrl?: string;
    pdfUrl?: string;
    externalUrl?: string;
    durationMinutes?: number;
    isFreePreview?: boolean;
    orderIndex?: number;
  }, user: { id: string; role: string }) {
    const existing = await this.prisma.lesson.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Lesson not found.');

    const updated = await this.prisma.lesson.update({
      where: { id },
      data: {
        title: data.title !== undefined ? data.title.trim() : undefined,
        description: data.description !== undefined ? data.description : undefined,
        type: data.type !== undefined ? data.type : undefined,
        contentMarkdown: data.contentMarkdown !== undefined ? data.contentMarkdown : undefined,
        videoUrl: data.videoUrl !== undefined ? data.videoUrl : undefined,
        slideUrl: data.slideUrl !== undefined ? data.slideUrl : undefined,
        pdfUrl: data.pdfUrl !== undefined ? data.pdfUrl : undefined,
        externalUrl: data.externalUrl !== undefined ? data.externalUrl : undefined,
        durationMinutes: data.durationMinutes !== undefined ? Number(data.durationMinutes) : undefined,
        isFreePreview: data.isFreePreview !== undefined ? Boolean(data.isFreePreview) : undefined,
        orderIndex: data.orderIndex !== undefined ? Number(data.orderIndex) : undefined,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'LESSON_UPDATED',
        resourceType: 'Lesson',
        resourceId: id,
        metadataJson: JSON.stringify({ updatedFields: Object.keys(data) }),
      },
    });

    return updated;
  }

  async deleteLesson(id: string, user: { id: string; role: string }) {
    const existing = await this.prisma.lesson.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Lesson not found.');

    await this.prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'LESSON_DELETED',
        resourceType: 'Lesson',
        resourceId: id,
        metadataJson: JSON.stringify({ title: existing.title }),
      },
    });

    await this.prisma.lesson.delete({ where: { id } });
    return { success: true, message: `Lesson "${existing.title}" deleted successfully.` };
  }

  async addResource(lessonId: string, data: {
    title: string;
    fileUrl: string;
    fileType?: string;
    fileSizeMb?: number;
    isDownloadable?: boolean;
  }, user: { id: string; role: string }) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException('Lesson not found.');

    const resource = await this.prisma.lessonResource.create({
      data: {
        lessonId,
        title: data.title.trim(),
        fileUrl: data.fileUrl.trim(),
        fileType: data.fileType || 'PDF',
        fileSizeMb: data.fileSizeMb ? Number(data.fileSizeMb) : 1.0,
        isDownloadable: data.isDownloadable !== undefined ? Boolean(data.isDownloadable) : true,
      },
    });

    return resource;
  }

  async deleteResource(resourceId: string, user: { id: string; role: string }) {
    await this.prisma.lessonResource.delete({ where: { id: resourceId } });
    return { success: true, message: 'Resource deleted.' };
  }
}
