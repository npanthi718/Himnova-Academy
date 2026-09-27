import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Submissions')
@Controller('submissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @Roles('STUDENT', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Submit an assignment solution' })
  async submitAssignment(
    @CurrentUser('id') studentId: string,
    @Body() body: any,
  ) {
    return this.submissionsService.submitAssignment(studentId, body);
  }

  @Get('trainer-list')
  @Roles('TRAINER', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get submissions queue for trainer/admin review' })
  async getTrainerSubmissions(@CurrentUser() user: { id: string; role: string }) {
    return this.submissionsService.getSubmissionsForTrainer(user.id, user.role);
  }

  @Put(':id/grade')
  @Roles('TRAINER', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Grade a submission with score and feedback' })
  async gradeSubmission(
    @Param('id') submissionId: string,
    @CurrentUser('id') trainerId: string,
    @Body() body: { score: number; feedback: string; status: string },
  ) {
    return this.submissionsService.gradeSubmission(submissionId, trainerId, body);
  }
}
