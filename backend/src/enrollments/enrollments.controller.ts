import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Enrollments')
@Controller('enrollments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get('my')
  @ApiOperation({ summary: 'Get courses enrolled by the authenticated student' })
  async getMyEnrollments(@CurrentUser('id') userId: string) {
    return this.enrollmentsService.getMyEnrollments(userId);
  }

  @Get()
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Get all enrollments (Admin only)' })
  async getAllEnrollments(
    @Query('courseId') courseId?: string,
    @Query('batchId') batchId?: string,
    @Query('search') search?: string,
  ) {
    return this.enrollmentsService.getAllEnrollments({ courseId, batchId, search });
  }

  @Post('admin-enroll')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Directly enroll student into a course/batch (Admin only)' })
  async adminEnroll(
    @Body() body: { userId: string; courseId: string; batchId?: string },
    @CurrentUser('id') adminId: string,
  ) {
    return this.enrollmentsService.enrollStudentDirectly(
      body.userId,
      body.courseId,
      body.batchId,
      adminId,
    );
  }
}
