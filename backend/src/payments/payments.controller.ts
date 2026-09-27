import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate payment for course checkout (eSewa/Khalti)' })
  async initiatePayment(
    @CurrentUser('id') userId: string,
    @Body() body: { courseId: string; provider: string; couponCode?: string },
  ) {
    return this.paymentsService.initiatePayment(userId, body);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify payment from payment gateway callback / webhook' })
  async verifyPayment(
    @Body() body: { orderId: string; provider: string; payload: any },
  ) {
    return this.paymentsService.verifyPayment(body.orderId, body.provider, body.payload);
  }

  @Post('manual-claim')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit manual offline QR code payment slip claim' })
  async submitManualClaim(
    @CurrentUser('id') userId: string,
    @Body() body: {
      courseId: string;
      amount: number;
      transactionId: string;
      senderName: string;
      senderPhone: string;
      bankWalletName: string;
      receiptScreenshotUrl?: string;
    },
  ) {
    return this.paymentsService.submitManualQrClaim(userId, body);
  }

  @Put(':orderId/verify-claim')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify or reject manual QR code payment claim (Admin only)' })
  async verifyClaim(
    @Param('orderId') orderId: string,
    @Body() body: { isApproved?: boolean; status?: string; adminNotes?: string },
    @CurrentUser('id') adminId: string,
  ) {
    return this.paymentsService.verifyManualClaim(orderId, body, adminId);
  }

  @Get('admin-list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all platform payment transactions (Admin only)' })
  async getAdminTransactions() {
    return this.paymentsService.getAdminTransactions();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete payment transaction record (Admin only)' })
  async deletePayment(@Param('id') id: string) {
    return this.paymentsService.deletePayment(id);
  }
}
