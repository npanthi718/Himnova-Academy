import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Assignments')
@Controller('assignments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get assignments appropriate for the current role' })
  async getAssignments(@CurrentUser() user: { id: string; role: string }) {
    return this.assignmentsService.findAllForUser(user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new assignment (Admin/Trainer)' })
  async createAssignment(
    @Body() data: any,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.assignmentsService.create(data, user);
  }
}
