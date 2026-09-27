import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: { category?: string; difficulty?: string; search?: string; isPublished?: boolean }) {
    const where: any = {};
    if (query?.category) {
      where.category = query.category;
    }
    if (query?.difficulty) {
      where.difficulty = query.difficulty;
    }
    if (query?.isPublished !== undefined) {
      where.isPublished = query.isPublished;
    }
    if (query?.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }

    const courses = await this.prisma.course.findMany({
      where,
      include: {
        modules: {
          include: {
            lessons: {
              select: {
                id: true,
                title: true,
                type: true,
                durationMinutes: true,
                isFreePreview: true,
                orderIndex: true,
              },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
        batches: {
          where: { status: { in: ['ENROLLING', 'ACTIVE'] } },
          select: {
            id: true,
            name: true,
            code: true,
            startDate: true,
            endDate: true,
            maxStudents: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return courses.map((c) => ({
      ...c,
      prerequisites: c.prerequisites ? JSON.parse(c.prerequisites) : [],
      learningOutcomes: c.learningOutcomes ? JSON.parse(c.learningOutcomes) : [],
    }));
  }

  async findBySlug(slug: string, userId?: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                resources: true,
                quizQuestions: true,
                assignments: true,
              },
              orderBy: { orderIndex: 'asc' },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
        batches: {
          include: {
            trainer: {
              select: { id: true, fullName: true, avatarUrl: true, bio: true },
            },
          },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with slug "${slug}" not found.`);
    }

    // Check if user is enrolled
    let isEnrolled = false;
    let enrollmentDetails: any = null;

    if (userId) {
      const enrollment = await this.prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: course.id,
          },
        },
        include: {
          batch: true,
        },
      });
      if (enrollment) {
        isEnrolled = true;
        enrollmentDetails = enrollment;
      }
    }

    return {
      ...course,
      prerequisites: course.prerequisites ? JSON.parse(course.prerequisites) : [],
      learningOutcomes: course.learningOutcomes ? JSON.parse(course.learningOutcomes) : [],
      isEnrolled,
      enrollmentDetails,
    };
  }

  async create(data: any, adminId: string) {
    const course = await this.prisma.course.create({
      data: {
        title: data.title,
        slug: data.slug,
        subtitle: data.subtitle || null,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl || null,
        category: data.category,
        difficulty: data.difficulty || 'BEGINNER',
        durationHours: Number(data.durationHours) || 40,
        price: Number(data.price) || 0,
        discountPrice: data.discountPrice ? Number(data.discountPrice) : null,
        currency: data.currency || 'NPR',
        isPublished: data.isPublished || false,
        isFeatured: data.isFeatured || false,
        prerequisites: data.prerequisites ? JSON.stringify(data.prerequisites) : null,
        learningOutcomes: data.learningOutcomes ? JSON.stringify(data.learningOutcomes) : null,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: 'COURSE_CREATED',
        resourceType: 'Course',
        resourceId: course.id,
        metadataJson: JSON.stringify({ title: course.title, price: course.price }),
      },
    });

    return course;
  }

  async update(id: string, data: any, adminId: string) {
    const updated = await this.prisma.course.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        subtitle: data.subtitle,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        category: data.category,
        difficulty: data.difficulty,
        durationHours: data.durationHours ? Number(data.durationHours) : undefined,
        price: data.price ? Number(data.price) : undefined,
        discountPrice: data.discountPrice !== undefined ? Number(data.discountPrice) : undefined,
        isPublished: data.isPublished,
        isFeatured: data.isFeatured,
        prerequisites: data.prerequisites ? JSON.stringify(data.prerequisites) : undefined,
        learningOutcomes: data.learningOutcomes ? JSON.stringify(data.learningOutcomes) : undefined,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: 'COURSE_UPDATED',
        resourceType: 'Course',
        resourceId: id,
      },
    });

    return updated;
  }

  async delete(id: string, adminId: string) {
    await this.prisma.course.delete({ where: { id } });
    await this.prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: 'COURSE_DELETED',
        resourceType: 'Course',
        resourceId: id,
      },
    });
    return { success: true };
  }

  async createModule(courseId: string, data: { title: string; description?: string; orderIndex?: number }, adminId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Course not found');
    const count = await this.prisma.courseModule.count({ where: { courseId } });
    const module = await this.prisma.courseModule.create({
      data: {
        courseId,
        title: data.title.trim(),
        description: data.description || null,
        orderIndex: data.orderIndex !== undefined ? Number(data.orderIndex) : count + 1,
      },
    });
    return module;
  }

  async updateModule(moduleId: string, data: { title?: string; description?: string; orderIndex?: number }, adminId: string) {
    const module = await this.prisma.courseModule.update({
      where: { id: moduleId },
      data: {
        title: data.title !== undefined ? data.title.trim() : undefined,
        description: data.description !== undefined ? data.description : undefined,
        orderIndex: data.orderIndex !== undefined ? Number(data.orderIndex) : undefined,
      },
    });
    return module;
  }

  async deleteModule(moduleId: string, adminId: string) {
    await this.prisma.courseModule.delete({ where: { id: moduleId } });
    return { success: true };
  }
}

