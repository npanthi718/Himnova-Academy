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
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Accounts & Expenses')
@Controller('accounts')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('overview')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Get total revenue, expenses, trainer payouts and net cash flow (Admin only)' })
  async getOverview() {
    return this.accountsService.getFinancialOverview();
  }

  // Expenses
  @Get('expenses')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'List all operational expenses (Admin only)' })
  async getExpenses(@Query('category') category?: string) {
    return this.accountsService.getExpenses(category);
  }

  @Post('expenses')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Record new operational expense (Admin only)' })
  async createExpense(
    @Body() body: { category: string; title: string; amount: number; date?: string; receiptUrl?: string; notes?: string },
    @CurrentUser('id') adminId: string,
  ) {
    return this.accountsService.createExpense(body, adminId);
  }

  @Delete('expenses/:id')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete expense record (Admin only)' })
  async deleteExpense(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
  ) {
    return this.accountsService.deleteExpense(id, adminId);
  }

  // Trainer Payouts
  @Get('payouts')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'List all trainer payouts (Admin only)' })
  async getPayouts(@Query('trainerId') trainerId?: string) {
    return this.accountsService.getTrainerPayouts(trainerId);
  }

  @Post('payouts')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Record or disburse trainer payout (Admin only)' })
  async createPayout(
    @Body() body: {
      trainerId: string;
      batchId?: string;
      amount: number;
      classesCount?: number;
      paymentMethod?: string;
      accountDetails?: string;
      referenceId?: string;
      status?: string;
      notes?: string;
    },
    @CurrentUser('id') adminId: string,
  ) {
    return this.accountsService.createTrainerPayout(body, adminId);
  }

  @Put('payouts/:id/status')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Update payout status to PAID or REJECTED (Admin only)' })
  async updatePayoutStatus(
    @Param('id') id: string,
    @Body() body: { status: string; referenceId?: string },
    @CurrentUser('id') adminId: string,
  ) {
    return this.accountsService.updatePayoutStatus(id, body.status, body.referenceId, adminId);
  }

  @Delete('payouts/:id')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete trainer payout record (Admin only)' })
  async deletePayout(
    @Param('id') id: string,
  ) {
    return this.accountsService.deleteTrainerPayout(id);
  }

  @Get('my-earnings')
  @Roles('TRAINER')
  @ApiOperation({ summary: 'Get current trainer payout history & conducted classes (Trainer only)' })
  async getMyEarnings(@CurrentUser('id') trainerId: string) {
    return this.accountsService.getMyTrainerEarnings(trainerId);
  }
}
