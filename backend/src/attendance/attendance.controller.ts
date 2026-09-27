import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Attendance')
@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('my')
  @ApiOperation({ summary: 'Get current student attendance record and rate' })
  async getMyAttendance(@CurrentUser('id') studentId: string) {
    return this.attendanceService.getMyAttendance(studentId);
  }

  @Get('batch/:batchId')
  @Roles('TRAINER', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get attendance records for a specific batch' })
  async getBatchAttendance(
    @Param('batchId') batchId: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.attendanceService.getBatchAttendance(batchId, user);
  }

  @Post('batch/:batchId/mark')
  @Roles('TRAINER', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Mark attendance for a batch' })
  async markBatchAttendance(
    @Param('batchId') batchId: string,
    @Body() body: { date: string; records: { studentId: string; status: string; notes?: string }[] },
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.attendanceService.markBatchAttendance(
      batchId,
      body.date,
      body.records,
      user.id,
      user.role,
    );
  }
}
