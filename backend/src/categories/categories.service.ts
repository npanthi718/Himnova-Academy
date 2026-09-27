import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: { courses: true },
        },
      },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async create(data: { name: string; slug: string; description?: string; icon?: string; orderIndex?: number }) {
    const slug = data.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');
    return this.prisma.category.create({
      data: {
        name: data.name.trim(),
        slug,
        description: data.description || null,
        icon: data.icon || 'Sparkles',
        orderIndex: data.orderIndex || 0,
      },
    });
  }

  async update(id: string, data: { name?: string; slug?: string; description?: string; icon?: string; orderIndex?: number }) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
