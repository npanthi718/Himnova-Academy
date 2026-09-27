import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Lessons')
@Controller('lessons')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get lesson content with resource-level authorization' })
  async getLesson(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.lessonsService.getLessonContent(id, user);
  }

  @Post(':id/progress')
  @ApiOperation({ summary: 'Update student progress for a lesson' })
  async updateProgress(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() body: { isCompleted?: boolean; lastPositionSeconds?: number },
  ) {
    return this.lessonsService.updateProgress(id, userId, body);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'TRAINER')
  @ApiOperation({ summary: 'Create new lesson with video/slide/notes attachments (Admin/Trainer)' })
  async createLesson(
    @Body() body: any,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.lessonsService.createLesson(body, user);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'TRAINER')
  @ApiOperation({ summary: 'Update lesson notes, video link, slides, or metadata (Admin/Trainer)' })
  async updateLesson(
    @Param('id') id: string,
    @Body() body: any,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.lessonsService.updateLesson(id, body, user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'TRAINER')
  @ApiOperation({ summary: 'Delete a lesson (Admin/Trainer)' })
  async deleteLesson(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.lessonsService.deleteLesson(id, user);
  }

  @Post(':id/resources')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'TRAINER')
  @ApiOperation({ summary: 'Add downloadable resource or cloud link to lesson' })
  async addResource(
    @Param('id') lessonId: string,
    @Body() body: any,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.lessonsService.addResource(lessonId, body, user);
  }

  @Delete('resources/:resourceId')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'TRAINER')
  @ApiOperation({ summary: 'Delete a lesson resource attachment' })
  async deleteResource(
    @Param('resourceId') resourceId: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.lessonsService.deleteResource(resourceId, user);
  }
}
