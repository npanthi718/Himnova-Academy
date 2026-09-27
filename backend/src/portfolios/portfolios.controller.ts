import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Portfolios')
@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @Get('public/:username')
  @ApiOperation({ summary: 'Get public recruiter portfolio by username or referral code' })
  async getPublicPortfolio(@Param('username') username: string) {
    return this.portfoliosService.getPublicPortfolioByUsername(username);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current student portfolio projects' })
  async getMyProjects(@CurrentUser('id') studentId: string) {
    return this.portfoliosService.getMyProjects(studentId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new portfolio project' })
  async createProject(
    @CurrentUser('id') studentId: string,
    @Body() body: any,
  ) {
    return this.portfoliosService.createProject(studentId, body);
  }
}
