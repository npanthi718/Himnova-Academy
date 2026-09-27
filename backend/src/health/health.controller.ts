import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../database/prisma.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Platform health and telemetry status' })
  async checkHealth() {
    let dbStatus = 'CONNECTED';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (e) {
      dbStatus = 'DISCONNECTED';
    }

    return {
      status: 'UP',
      organization: 'Himnova Technologies Pvt. Ltd.',
      platform: 'Himnova AI Career Launchpad API',
      version: '2.6.0-enterprise',
      database: dbStatus,
      uptimeSeconds: process.uptime(),
      timestamp: new Date().toISOString(),
      region: 'ap-south-1 (Kathmandu / Mumbai Node)',
    };
  }
}
