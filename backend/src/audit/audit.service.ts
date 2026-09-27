import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: { action?: string; resourceType?: string; limit?: number }) {
    const where: any = {};
    if (query?.action) where.action = query.action;
    if (query?.resourceType) where.resourceType = query.resourceType;

    return this.prisma.auditLog.findMany({
      where,
      include: {
        actor: { select: { id: true, fullName: true, email: true, role: true } },
      },
      orderBy: { timestamp: 'desc' },
      take: query?.limit || 100,
    });
  }
}
