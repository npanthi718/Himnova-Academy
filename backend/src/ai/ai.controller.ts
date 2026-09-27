import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('AI')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('prompt')
  @ApiOperation({ summary: 'Process AI tutor prompt with course authorization check' })
  async processPrompt(
    @CurrentUser() user: { id: string; role: string },
    @Body() body: {
      courseId?: string;
      lessonId?: string;
      prompt: string;
      contextType: 'COURSE_TUTOR' | 'NOTES_SUMMARY' | 'QUIZ_GENERATOR' | 'RESUME_REVIEW' | 'INTERVIEW_PREP' | 'CAREER_ROADMAP';
    },
  ) {
    return this.aiService.processAiPrompt(user.id, user.role, body);
  }
}
