import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async markBatchAttendance(
    batchId: string,
    dateStr: string,
    records: { studentId: string; status: string; notes?: string }[],
    trainerId: string,
    userRole: string
  ) {
    if (userRole === 'TRAINER') {
      const batch = await this.prisma.batch.findUnique({ where: { id: batchId } });
      if (!batch || batch.trainerId !== trainerId) {
        throw new ForbiddenException('Cannot mark attendance for a batch not assigned to you.');
      }
    }

    const targetDate = new Date(dateStr);

    const savedRecords = [];
    for (const rec of records) {
      // Find existing or create new for this date & student
      const existing = await this.prisma.attendanceRecord.findFirst({
        where: {
          batchId,
          studentId: rec.studentId,
          date: {
            gte: new Date(targetDate.setHours(0, 0, 0, 0)),
            lte: new Date(targetDate.setHours(23, 59, 59, 999)),
          },
        },
      });

      if (existing) {
        const updated = await this.prisma.attendanceRecord.update({
          where: { id: existing.id },
          data: {
            status: rec.status,
            notes: rec.notes,
            markedById: trainerId,
          },
        });
        savedRecords.push(updated);
      } else {
        const created = await this.prisma.attendanceRecord.create({
          data: {
            batchId,
            studentId: rec.studentId,
            date: new Date(dateStr),
            status: rec.status,
            notes: rec.notes,
            markedById: trainerId,
          },
        });
        savedRecords.push(created);
      }
    }

    return savedRecords;
  }

  async getBatchAttendance(batchId: string, user: { id: string; role: string }) {
    if (user.role === 'TRAINER') {
      const batch = await this.prisma.batch.findUnique({ where: { id: batchId } });
      if (!batch || batch.trainerId !== user.id) {
        throw new ForbiddenException('Unauthorized batch access.');
      }
    }

    return this.prisma.attendanceRecord.findMany({
      where: { batchId },
      include: {
        student: {
          select: { id: true, fullName: true, email: true, avatarUrl: true },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async getMyAttendance(studentId: string) {
    const records = await this.prisma.attendanceRecord.findMany({
      where: { studentId },
      include: {
        batch: {
          include: {
            course: { select: { id: true, title: true } },
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    const total = records.length;
    const presentCount = records.filter((r) => r.status === 'PRESENT').length;
    const lateCount = records.filter((r) => r.status === 'LATE').length;
    const absentCount = records.filter((r) => r.status === 'ABSENT').length;

    const rate = total > 0 ? ((presentCount + lateCount * 0.5) / total) * 100 : 100;

    return {
      records,
      summary: {
        totalDays: total,
        present: presentCount,
        late: lateCount,
        absent: absentCount,
        attendanceRate: Number(rate.toFixed(1)),
      },
    };
  }
}
