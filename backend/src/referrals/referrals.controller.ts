import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Referrals')
@Controller('referrals')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Get('my')
  @ApiOperation({ summary: 'Get current student referral program stats and reward ledger' })
  async getMyReferralData(@CurrentUser('id') userId: string) {
    return this.referralsService.getMyReferralData(userId);
  }

  @Get('admin-list')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Get all platform referral logs (Admin only)' })
  async getAllReferrals() {
    return this.referralsService.getAllReferralsForAdmin();
  }

  @Put(':id/status')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Update referral reward status / giveaway disbursement' })
  async updateReferralStatus(
    @Param('id') id: string,
    @Body() body: { status: string; rewardAmount?: number },
  ) {
    return this.referralsService.updateStatus(id, body.status, body.rewardAmount);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete referral transaction record (Admin only)' })
  async deleteReferral(@Param('id') id: string) {
    return this.referralsService.deleteReferral(id);
  }
}
