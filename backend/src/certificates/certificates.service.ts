import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as QRCode from 'qrcode';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  async getCertificateByNumber(certificateNumber: string) {
    const cert = await this.prisma.certificate.findUnique({
      where: { certificateNumber },
      include: {
        student: {
          select: { id: true, fullName: true, email: true, avatarUrl: true },
        },
        course: {
          select: { id: true, title: true, slug: true, durationHours: true, category: true, difficulty: true },
        },
      },
    });

    if (!cert) {
      throw new NotFoundException({
        code: 'CERTIFICATE_NOT_FOUND',
        message: 'No verified Himnova certificate was found matching this identification number.',
      });
    }

    return cert;
  }

  async getMyCertificates(studentId: string) {
    return this.prisma.certificate.findMany({
      where: { studentId },
      include: {
        course: { select: { id: true, title: true, slug: true, durationHours: true } },
      },
      orderBy: { issueDate: 'desc' },
    });
  }

  async getAllCertificates() {
    return this.prisma.certificate.findMany({
      include: {
        student: { select: { id: true, fullName: true, email: true } },
        course: { select: { id: true, title: true, durationHours: true } },
      },
      orderBy: { issueDate: 'desc' },
    });
  }

  async generateCertificate(data: {
    studentId: string;
    courseId: string;
    batchId?: string;
    recipientName?: string;
    customTitle?: string;
    customDescription?: string;
    customSkills?: string;
    customHonor?: string;
    score?: number;
    issueDate?: string;
    signatoryName?: string;
    signatoryTitle?: string;
  }) {
    // Check if certificate already issued
    const existing = await this.prisma.certificate.findFirst({
      where: { studentId: data.studentId, courseId: data.courseId },
      include: {
        student: { select: { id: true, fullName: true, email: true } },
        course: { select: { id: true, title: true } },
      },
    });

    if (existing) {
      // If admin updates it, update custom content
      const updated = await this.prisma.certificate.update({
        where: { id: existing.id },
        data: {
          recipientName: data.recipientName || undefined,
          customTitle: data.customTitle || undefined,
          customDescription: data.customDescription || undefined,
          customSkills: data.customSkills || undefined,
          customHonor: data.customHonor || undefined,
          completionScore: data.score !== undefined ? Number(data.score) : undefined,
          signatoryName: data.signatoryName || undefined,
          signatoryTitle: data.signatoryTitle || undefined,
          issueDate: data.issueDate ? new Date(data.issueDate) : undefined,
        },
        include: {
          student: { select: { id: true, fullName: true, email: true } },
          course: { select: { id: true, title: true, durationHours: true } },
        },
      });
      return updated;
    }

    const certSuffix = Math.floor(1000 + Math.random() * 9000);
    const certificateNumber = `HIM-CERT-2026-${certSuffix}`;
    const verificationUrl = `http://localhost:3000/verify/${certificateNumber}`;

    const qrCodeUrl = await QRCode.toDataURL(verificationUrl, {
      margin: 2,
      width: 256,
      color: {
        dark: '#030712',
        light: '#FFFFFF',
      },
    });

    const cert = await this.prisma.certificate.create({
      data: {
        certificateNumber,
        studentId: data.studentId,
        courseId: data.courseId,
        batchId: data.batchId || null,
        recipientName: data.recipientName || null,
        customTitle: data.customTitle || 'Certificate of Professional Engineering Excellence',
        customDescription: data.customDescription || null,
        customSkills: data.customSkills || null,
        customHonor: data.customHonor || 'Distinction & Capstone Excellence',
        completionScore: data.score || 96.0,
        issueDate: data.issueDate ? new Date(data.issueDate) : new Date(),
        qrCodeUrl,
        verificationUrl,
        signatoryName: data.signatoryName || 'Sushil Panthi',
        signatoryTitle: data.signatoryTitle || 'Director & Lead AI Architect, Himnova Technologies Private Limited',
        isValid: true,
      },
      include: {
        student: { select: { id: true, fullName: true, email: true } },
        course: { select: { id: true, title: true, durationHours: true } },
      },
    });

    // Notify student
    await this.prisma.notificationItem.create({
      data: {
        userId: data.studentId,
        title: 'Official Certificate Issued! 🎓',
        message: `Congratulations! Your verified Himnova certificate for "${cert.course.title}" is ready to view and share.`,
        type: 'SUCCESS',
        linkUrl: `/student/certificates`,
      },
    });

    return cert;
  }

  async deleteCertificate(id: string) {
    const cert = await this.prisma.certificate.findUnique({ where: { id } });
    if (!cert) throw new NotFoundException('Certificate not found.');

    await this.prisma.certificate.delete({ where: { id } });
    return { success: true, message: `Certificate ${cert.certificateNumber} revoked/deleted.` };
  }
}
