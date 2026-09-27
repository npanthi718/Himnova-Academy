import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Get all users with optional role and search filters (Admin only)' })
  async getUsers(
    @Query('role') role?: string,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll(role, search);
  }

  @Post()
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Create new student or trainer account with optional auto-enrollment (Admin only)' })
  async createUser(
    @Body() body: {
      fullName: string;
      email: string;
      password?: string;
      role: 'SUPER_ADMIN' | 'TRAINER' | 'STUDENT';
      phoneNumber?: string;
      courseId?: string;
      batchId?: string;
      hourlyRate?: number;
      payoutAccount?: string;
      specialties?: string;
    },
    @CurrentUser('id') adminId: string,
  ) {
    return this.usersService.createUser(body, adminId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update profile information for current user' })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() body: {
      fullName?: string;
      phoneNumber?: string;
      bio?: string;
      avatarUrl?: string;
      hourlyRate?: number;
      payoutAccount?: string;
      specialties?: string;
    },
  ) {
    return this.usersService.updateProfile(userId, body);
  }

  @Put('change-password')
  @ApiOperation({ summary: 'Change password for current user' })
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() body: { oldPass: string; newPass: string },
  ) {
    return this.usersService.changePassword(userId, body.oldPass, body.newPass);
  }

  @Get(':id/history')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Get full learning, submission, attendance, payment & audit history for user (Admin only)' })
  async getUserHistory(@Param('id') id: string) {
    return this.usersService.getFullHistory(id);
  }

  @Get(':id/check-conflict')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Check live class schedule conflict for student against target batch' })
  async checkConflict(
    @Param('id') id: string,
    @Query('batchId') batchId: string,
  ) {
    return this.usersService.checkScheduleConflict(id, batchId);
  }

  @Put(':id/admin-update')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Super Admin edits any user profile, role, status or payout details (Admin only)' })
  async adminUpdateUser(
    @Param('id') id: string,
    @Body() body: any,
    @CurrentUser('id') adminId: string,
  ) {
    return this.usersService.adminUpdateUser(id, body, adminId);
  }

  @Post(':id/shift-course')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Super Admin migrates/shifts student course or batch (Admin only)' })
  async shiftCourse(
    @Param('id') id: string,
    @Body() body: {
      targetCourseId: string;
      targetBatchId?: string;
      oldCourseId?: string;
      replaceOldEnrollment?: boolean;
      reason?: string;
    },
    @CurrentUser('id') adminId: string,
  ) {
    return this.usersService.shiftStudentCourseBatch(id, body, adminId);
  }

  @Post(':id/reset-password-admin')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Super Admin directly resets password for any user account (Admin only)' })
  async resetPasswordAdmin(
    @Param('id') id: string,
    @Body() body: { newPassword: string },
    @CurrentUser('id') adminId: string,
  ) {
    return this.usersService.adminResetPassword(id, body.newPassword, adminId);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete user account with audit log (Admin only)' })
  async deleteUser(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
  ) {
    return this.usersService.deleteUser(id, adminId);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'TRAINER')
  @ApiOperation({ summary: 'Get single user detail with learning/batch history' })
  async getUser(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id/status')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Toggle user account activation status (Admin only)' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { isActive: boolean },
    @CurrentUser('id') adminId: string,
  ) {
    return this.usersService.updateStatus(id, body.isActive, adminId);
  }
}
