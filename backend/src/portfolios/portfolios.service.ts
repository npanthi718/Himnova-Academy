import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PortfoliosService {
  constructor(private prisma: PrismaService) {}

  async getPublicPortfolioByUsername(username: string) {
    // Find user by referral code, email prefix or ID
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { referralCode: username.toUpperCase() },
          { id: username },
          { email: { startsWith: username.toLowerCase() } },
        ],
      },
      select: {
        id: true,
        fullName: true,
        bio: true,
        avatarUrl: true,
        role: true,
        portfolioProjects: {
          where: { isPublished: true },
          include: {
            course: { select: { id: true, title: true, category: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        certificates: {
          where: { isValid: true },
          include: {
            course: { select: { id: true, title: true, durationHours: true } },
          },
        },
        enrollments: {
          where: { isCompleted: true },
          include: {
            course: { select: { id: true, title: true } },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Public portfolio not found.');
    }

    return {
      ...user,
      portfolioProjects: user.portfolioProjects.map((p) => ({
        ...p,
        technologies: p.technologiesJson ? JSON.parse(p.technologiesJson) : [],
      })),
    };
  }

  async getMyProjects(studentId: string) {
    const projects = await this.prisma.portfolioProject.findMany({
      where: { studentId },
      include: {
        course: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return projects.map((p) => ({
      ...p,
      technologies: p.technologiesJson ? JSON.parse(p.technologiesJson) : [],
    }));
  }

  async createProject(studentId: string, data: any) {
    const baseSlug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const project = await this.prisma.portfolioProject.create({
      data: {
        studentId,
        title: data.title,
        slug,
        description: data.description,
        technologiesJson: data.technologies ? JSON.stringify(data.technologies) : JSON.stringify([]),
        thumbnailUrl: data.thumbnailUrl || null,
        githubUrl: data.githubUrl || null,
        liveUrl: data.liveUrl || null,
        videoDemoUrl: data.videoDemoUrl || null,
        courseId: data.courseId || null,
        isPublished: data.isPublished !== undefined ? data.isPublished : true,
      },
    });

    return {
      ...project,
      technologies: project.technologiesJson ? JSON.parse(project.technologiesJson) : [],
    };
  }
}
