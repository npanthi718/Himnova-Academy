import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { LiveClassesService } from './live-classes.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('LiveClasses')
@Controller('live-classes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LiveClassesController {
  constructor(private readonly liveClassesService: LiveClassesService) {}

  @Get('my')
  @ApiOperation({ summary: 'Get authorized live classes for current user' })
  async getMyLiveClasses(@CurrentUser() user: { id: string; role: string }) {
    return this.liveClassesService.getMyLiveClasses(user);
  }

  @Post()
  @ApiOperation({ summary: 'Schedule a live class (Trainer/Admin)' })
  async scheduleLiveClass(
    @Body() body: any,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.liveClassesService.createLiveClass(body, user);
  }
}
