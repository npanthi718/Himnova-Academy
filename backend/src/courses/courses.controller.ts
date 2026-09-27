import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all courses with optional filters' })
  async getAllCourses(
    @Query('category') category?: string,
    @Query('difficulty') difficulty?: string,
    @Query('search') search?: string,
    @Query('isPublished') isPublished?: string,
  ) {
    const published = isPublished !== undefined ? isPublished === 'true' : undefined;
    return this.coursesService.findAll({ category, difficulty, search, isPublished: published });
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get course details by slug' })
  async getCourseBySlug(
    @Param('slug') slug: string,
    @Query('userId') userId?: string,
  ) {
    return this.coursesService.findBySlug(slug, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new course (Admin only)' })
  async createCourse(@Body() data: any, @CurrentUser('id') adminId: string) {
    return this.coursesService.create(data, adminId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'TRAINER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update course details' })
  async updateCourse(
    @Param('id') id: string,
    @Body() data: any,
    @CurrentUser('id') userId: string,
  ) {
    return this.coursesService.update(id, data, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a course (Admin only)' })
  async deleteCourse(@Param('id') id: string, @CurrentUser('id') adminId: string) {
    return this.coursesService.delete(id, adminId);
  }

  @Post(':id/modules')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'TRAINER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a module in a course (Admin / Trainer)' })
  async createModule(
    @Param('id') courseId: string,
    @Body() data: any,
    @CurrentUser('id') adminId: string,
  ) {
    return this.coursesService.createModule(courseId, data, adminId);
  }

  @Put('modules/:moduleId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'TRAINER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a module (Admin / Trainer)' })
  async updateModule(
    @Param('moduleId') moduleId: string,
    @Body() data: any,
    @CurrentUser('id') adminId: string,
  ) {
    return this.coursesService.updateModule(moduleId, data, adminId);
  }

  @Delete('modules/:moduleId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a module (Admin only)' })
  async deleteModule(
    @Param('moduleId') moduleId: string,
    @CurrentUser('id') adminId: string,
  ) {
    return this.coursesService.deleteModule(moduleId, adminId);
  }
}

