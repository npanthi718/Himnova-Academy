import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(role?: string, search?: string) {
    const where: any = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { email: { contains: search } },
        { referralCode: { contains: search } },
        { phoneNumber: { contains: search } },
      ];
    }

    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        avatarUrl: true,
        phoneNumber: true,
        bio: true,
        hourlyRate: true,
        payoutAccount: true,
        specialties: true,
        referralCode: true,
        isActive: true,
        createdAt: true,
        enrollments: {
          include: {
            course: { select: { id: true, title: true, slug: true } },
            batch: { select: { id: true, name: true, code: true } },
          },
        },
        assignedBatches: {
          include: {
            course: { select: { id: true, title: true } },
          },
        },
        _count: {
          select: {
            enrollments: true,
            submissions: true,
            certificates: true,
            assignedBatches: true,
            attendanceRecords: true,
            payments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        enrollments: { include: { course: true, batch: true } },
        certificates: { include: { course: true } },
        portfolioProjects: true,
        assignedBatches: { include: { course: true, students: { include: { student: true } } } },
      },
    });

    if (!user) throw new NotFoundException('User not found.');

    const { passwordHash, mfaSecret, ...safeUser } = user;
    return safeUser;
  }

  async getFullHistory(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                modules: {
                  include: {
                    lessons: { select: { id: true, title: true, type: true } },
                  },
                },
              },
            },
            batch: {
              include: {
                trainer: { select: { id: true, fullName: true, email: true } },
              },
            },
          },
        },
        batchMemberships: {
          include: {
            batch: {
              include: {
                course: { select: { id: true, title: true } },
                trainer: { select: { id: true, fullName: true, email: true } },
              },
            },
          },
        },
        assignedBatches: {
          include: {
            course: { select: { id: true, title: true } },
            students: {
              include: {
                student: { select: { id: true, fullName: true, email: true, phoneNumber: true } },
              },
            },
            liveClasses: true,
            attendanceRecords: { take: 20, orderBy: { date: 'desc' } },
            trainerPayouts: true,
          },
        },
        attendanceRecords: {
          include: {
            batch: { select: { id: true, name: true, code: true } },
          },
          orderBy: { date: 'desc' },
        },
        submissions: {
          include: {
            assignment: {
              include: {
                lesson: { select: { id: true, title: true } },
                batch: { select: { id: true, name: true } },
              },
            },
          },
          orderBy: { submittedAt: 'desc' },
        },
        payments: {
          include: {
            course: { select: { id: true, title: true, price: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        certificates: {
          include: {
            course: { select: { id: true, title: true, durationHours: true } },
          },
          orderBy: { issueDate: 'desc' },
        },
        trainerPayouts: {
          include: {
            batch: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        lessonProgresses: {
          take: 50,
          orderBy: { updatedAt: 'desc' },
        },
      },
    });

    if (!user) throw new NotFoundException('User profile not found.');

    const auditLogs = await this.prisma.auditLog.findMany({
      where: {
        OR: [{ actorId: id }, { resourceId: id }],
      },
      take: 50,
      orderBy: { timestamp: 'desc' },
    });

    const { passwordHash, mfaSecret, ...safeUser } = user;
    return {
      ...safeUser,
      auditLogs,
    };
  }

  async adminUpdateUser(
    id: string,
    data: {
      fullName?: string;
      email?: string;
      phoneNumber?: string;
      role?: 'SUPER_ADMIN' | 'TRAINER' | 'STUDENT';
      isActive?: boolean;
      bio?: string;
      avatarUrl?: string;
      hourlyRate?: number;
      payoutAccount?: string;
      specialties?: string;
    },
    adminId: string,
  ) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('User not found.');

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        fullName: data.fullName !== undefined ? data.fullName.trim() : undefined,
        email: data.email !== undefined ? data.email.toLowerCase().trim() : undefined,
        phoneNumber: data.phoneNumber !== undefined ? data.phoneNumber : undefined,
        role: data.role !== undefined ? data.role : undefined,
        isActive: data.isActive !== undefined ? data.isActive : undefined,
        bio: data.bio !== undefined ? data.bio : undefined,
        avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : undefined,
        hourlyRate: data.hourlyRate !== undefined ? Number(data.hourlyRate) : undefined,
        payoutAccount: data.payoutAccount !== undefined ? data.payoutAccount : undefined,
        specialties: data.specialties !== undefined ? data.specialties : undefined,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: 'USER_ADMIN_UPDATED',
        resourceType: 'User',
        resourceId: id,
        metadataJson: JSON.stringify({
          updatedFields: Object.keys(data),
          previousRole: existing.role,
          newRole: updated.role,
        }),
      },
    });

    const { passwordHash, mfaSecret, ...safeUser } = updated;
    return safeUser;
  }

  async checkScheduleConflict(userId: string, targetBatchId: string) {
    const targetBatch = await this.prisma.batch.findUnique({
      where: { id: targetBatchId },
      include: { course: true },
    });
    if (!targetBatch || !targetBatch.classTiming) return { hasConflict: false };

    const activeEnrollments = await this.prisma.enrollment.findMany({
      where: {
        userId,
        isCompleted: false,
        batchId: { not: null },
      },
      include: {
        course: true,
        batch: true,
      },
    });

    for (const enr of activeEnrollments) {
      if (enr.batchId === targetBatchId) continue;
      if (enr.batch && enr.batch.classTiming) {
        const t1 = enr.batch.classTiming.trim().toLowerCase();
        const t2 = targetBatch.classTiming.trim().toLowerCase();
        if (t1 === t2 || t1.includes(t2) || t2.includes(t1)) {
          return {
            hasConflict: true,
            warning: `Schedule Conflict: Student is currently enrolled in "${enr.course.title}" (${enr.batch.name}) with matching class timing: ${enr.batch.classTiming}.`,
            conflictingCourse: enr.course.title,
            conflictingBatch: enr.batch.name,
            classTiming: enr.batch.classTiming,
            scheduleDays: enr.batch.scheduleDays,
          };
        }
      }
    }

    return { hasConflict: false };
  }

  async shiftStudentCourseBatch(
    userId: string,
    data: {
      targetCourseId: string;
      targetBatchId?: string;
      oldCourseId?: string;
      replaceOldEnrollment?: boolean;
      reason?: string;
    },
    adminId: string,
  ) {
    const student = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!student) throw new NotFoundException('Student not found.');

    const targetCourse = await this.prisma.course.findUnique({
      where: { id: data.targetCourseId },
      include: { batches: { take: 1 } },
    });
    if (!targetCourse) throw new NotFoundException('Target course not found.');

    const batchIdToUse = data.targetBatchId || (targetCourse.batches[0] ? targetCourse.batches[0].id : null);

    // If replace old enrollment is selected
    if (data.replaceOldEnrollment && data.oldCourseId) {
      await this.prisma.enrollment.deleteMany({
        where: {
          userId,
          courseId: data.oldCourseId,
        },
      });
    }

    const totalLessons = await this.prisma.lesson.count({
      where: { module: { courseId: data.targetCourseId } },
    });

    const enrollment = await this.prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId: data.targetCourseId,
        },
      },
      update: {
        batchId: batchIdToUse,
        totalLessonsCount: totalLessons,
      },
      create: {
        userId,
        courseId: data.targetCourseId,
        batchId: batchIdToUse,
        totalLessonsCount: totalLessons,
        completedLessonsCount: 0,
        progressPercentage: 0,
      },
    });

    if (batchIdToUse) {
      await this.prisma.batchStudent.upsert({
        where: {
          batchId_studentId: {
            batchId: batchIdToUse,
            studentId: userId,
          },
        },
        update: {},
        create: {
          batchId: batchIdToUse,
          studentId: userId,
        },
      });
    }

    await this.prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: 'STUDENT_COURSE_SHIFTED',
        resourceType: 'Enrollment',
        resourceId: enrollment.id,
        metadataJson: JSON.stringify({
          studentId: userId,
          targetCourse: targetCourse.title,
          targetBatchId: batchIdToUse,
          reason: data.reason || 'Admin course/batch migration',
        }),
      },
    });

    return {
      success: true,
      message: `Student successfully enrolled in ${targetCourse.title}`,
      enrollment,
    };
  }

  async adminResetPassword(userId: string, newPass: string, adminId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found.');

    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash(newPass, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: 'PASSWORD_RESET_ADMIN',
        resourceType: 'User',
        resourceId: userId,
        metadataJson: JSON.stringify({ resetForEmail: user.email }),
      },
    });

    return { success: true, message: `Password reset successfully for ${user.fullName} (${user.email})` };
  }

  async deleteUser(userId: string, adminId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found.');

    if (user.role === 'SUPER_ADMIN') {
      const adminCount = await this.prisma.user.count({ where: { role: 'SUPER_ADMIN' } });
      if (adminCount <= 1) {
        throw new BadRequestException('Cannot delete the last Super Admin in the system.');
      }
    }

    await this.prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: 'USER_DELETED',
        resourceType: 'User',
        resourceId: userId,
        metadataJson: JSON.stringify({ deletedEmail: user.email, deletedName: user.fullName, role: user.role }),
      },
    });

    await this.prisma.user.delete({ where: { id: userId } });

    return { success: true, message: `User ${user.fullName} removed from database.` };
  }

  async updateStatus(id: string, isActive: boolean, adminId: string) {
    const updated = await this.prisma.user.update({
      where: { id },
      data: { isActive },
      select: { id: true, email: true, fullName: true, isActive: true },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: 'ROLE_CHANGED',
        resourceType: 'User',
        resourceId: id,
        metadataJson: JSON.stringify({ isActive }),
      },
    });

    return updated;
  }

  async createUser(
    data: {
      fullName: string;
      email: string;
      password?: string;
      role: 'SUPER_ADMIN' | 'TRAINER' | 'STUDENT';
      phoneNumber?: string;
      avatarUrl?: string;
      courseId?: string;
      batchId?: string;
      hourlyRate?: number;
      payoutAccount?: string;
      specialties?: string;
    },
    adminId: string,
  ) {
    const bcrypt = require('bcryptjs');
    const defaultPass = data.password || 'Student@123';
    const passwordHash = await bcrypt.hash(defaultPass, 10);
    const referralCode = `HIM-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const user = await this.prisma.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        passwordHash,
        fullName: data.fullName.trim(),
        role: data.role || 'STUDENT',
        phoneNumber: data.phoneNumber || null,
        avatarUrl: data.avatarUrl || null,
        hourlyRate: data.hourlyRate !== undefined ? Number(data.hourlyRate) : undefined,
        payoutAccount: data.payoutAccount || null,
        specialties: data.specialties || null,
        referralCode,
        isActive: true,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        phoneNumber: true,
        referralCode: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (data.courseId && user.role === 'STUDENT') {
      const courseLessons = await this.prisma.lesson.count({
        where: { module: { courseId: data.courseId } },
      });

      await this.prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: data.courseId,
          batchId: data.batchId || null,
          totalLessonsCount: courseLessons,
          completedLessonsCount: 0,
          progressPercentage: 0,
        },
      });

      if (data.batchId) {
        await this.prisma.batchStudent.create({
          data: {
            batchId: data.batchId,
            studentId: user.id,
          },
        });
      }
    }

    await this.prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: 'USER_CREATED',
        resourceType: 'User',
        resourceId: user.id,
        metadataJson: JSON.stringify({ email: user.email, role: user.role }),
      },
    });

    return user;
  }

  async updateProfile(
    userId: string,
    data: {
      fullName?: string;
      phoneNumber?: string;
      bio?: string;
      avatarUrl?: string;
      hourlyRate?: number;
      payoutAccount?: string;
      specialties?: string;
    },
  ) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        fullName: data.fullName || undefined,
        phoneNumber: data.phoneNumber || undefined,
        bio: data.bio || undefined,
        avatarUrl: data.avatarUrl || undefined,
        hourlyRate: data.hourlyRate !== undefined ? Number(data.hourlyRate) : undefined,
        payoutAccount: data.payoutAccount || undefined,
        specialties: data.specialties || undefined,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        phoneNumber: true,
        bio: true,
        avatarUrl: true,
        hourlyRate: true,
        payoutAccount: true,
        specialties: true,
        referralCode: true,
      },
    });

    return updated;
  }

  async changePassword(userId: string, oldPass: string, newPass: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found.');

    const bcrypt = require('bcryptjs');
    const isValid = await bcrypt.compare(oldPass, user.passwordHash);
    if (!isValid) throw new NotFoundException('Current password does not match.');

    const newHash = await bcrypt.hash(newPass, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    return { success: true, message: 'Password updated successfully!' };
  }
}
