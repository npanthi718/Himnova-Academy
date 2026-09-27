import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      return null;
    }

    const { passwordHash, mfaSecret, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto, reqMeta?: { ip?: string; userAgent?: string }) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      // Record failed login in audit
      await this.prisma.auditLog.create({
        data: {
          action: 'LOGIN_FAILED',
          resourceType: 'User',
          actorEmail: loginDto.email,
          ipAddress: reqMeta?.ip,
          userAgent: reqMeta?.userAgent,
        },
      });
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email address or password. Please verify your credentials.',
      });
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Your account has been deactivated. Please contact support.');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: loginDto.rememberMe ? '7d' : '1d',
    });

    // Determine role redirect
    let redirectUrl = '/student';
    if (user.role === 'SUPER_ADMIN') {
      redirectUrl = '/admin';
    } else if (user.role === 'TRAINER') {
      redirectUrl = '/trainer';
    }

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        actorId: user.id,
        actorEmail: user.email,
        actorRole: user.role,
        action: 'LOGIN_SUCCESS',
        resourceType: 'User',
        resourceId: user.id,
        ipAddress: reqMeta?.ip,
        userAgent: reqMeta?.userAgent,
      },
    });

    return {
      accessToken,
      expiresIn: loginDto.rememberMe ? 604800 : 86400,
      redirectUrl,
      user,
    };
  }

  async register(registerDto: RegisterDto, reqMeta?: { ip?: string; userAgent?: string }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: registerDto.email.toLowerCase().trim() },
    });

    if (existing) {
      throw new ConflictException({
        code: 'EMAIL_ALREADY_REGISTERED',
        message: 'An account with this email address already exists. Please log in instead.',
      });
    }

    // Generate unique referral code
    const baseCode = registerDto.fullName
      .replace(/[^a-zA-Z]/g, '')
      .slice(0, 6)
      .toUpperCase();
    const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
    const referralCode = `${baseCode}-${uniqueSuffix}`;

    // Check if referred by someone
    let referredById: string | null = null;
    if (registerDto.referralCode) {
      const referrer = await this.prisma.user.findUnique({
        where: { referralCode: registerDto.referralCode.trim() },
      });
      if (referrer) {
        referredById = referrer.id;
      }
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email.toLowerCase().trim(),
        fullName: registerDto.fullName.trim(),
        passwordHash,
        phoneNumber: registerDto.phoneNumber || null,
        role: 'STUDENT',
        referralCode,
        referredById,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(registerDto.fullName)}`,
      },
    });

    // Welcome Notification
    await this.prisma.notificationItem.create({
      data: {
        userId: user.id,
        title: 'Welcome to Himnova AI Career Launchpad! 🚀',
        message: 'Your account is ready. Explore our industry masterclasses and start your career progression today.',
        type: 'SUCCESS',
        linkUrl: '/courses',
      },
    });

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        actorId: user.id,
        actorEmail: user.email,
        actorRole: user.role,
        action: 'STUDENT_ENROLLED',
        resourceType: 'User',
        resourceId: user.id,
        ipAddress: reqMeta?.ip,
        userAgent: reqMeta?.userAgent,
      },
    });

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });

    const { passwordHash: _, ...safeUser } = user;

    return {
      accessToken,
      expiresIn: 86400,
      redirectUrl: '/student',
      user: safeUser,
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        phoneNumber: true,
        bio: true,
        referralCode: true,
        referredById: true,
        isMfaEnabled: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    return user;
  }
}
