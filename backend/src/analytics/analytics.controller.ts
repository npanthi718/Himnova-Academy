import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('admin-summary')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Get aggregated platform analytics for Admin Command Center' })
  async getAdminSummary() {
    return this.analyticsService.getAdminDashboardMetrics();
  }

  @Get('trainer-summary')
  @Roles('TRAINER')
  @ApiOperation({ summary: 'Get trainer-assigned batches analytics' })
  async getTrainerSummary(@CurrentUser('id') trainerId: string) {
    return this.analyticsService.getTrainerMetrics(trainerId);
  }

  @Get('student-summary')
  @ApiOperation({ summary: 'Get personal learning analytics for student' })
  async getStudentSummary(@CurrentUser('id') studentId: string) {
    return this.analyticsService.getStudentMetrics(studentId);
  }
}
