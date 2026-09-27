import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Certificates')
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get('verify/:certificateNumber')
  @ApiOperation({ summary: 'Publicly verify a certificate by certificate identification number' })
  async verify(@Param('certificateNumber') certificateNumber: string) {
    return this.certificatesService.getCertificateByNumber(certificateNumber);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all certificates issued to current logged-in student' })
  async getMyCertificates(@CurrentUser('id') studentId: string) {
    return this.certificatesService.getMyCertificates(studentId);
  }

  @Get('admin-list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all certificates issued across the platform (Admin only)' })
  async getAllCertificates() {
    return this.certificatesService.getAllCertificates();
  }

  @Post('issue')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Manually issue a verified certificate (Admin only)' })
  async issueCertificate(@Body() body: any) {
    return this.certificatesService.generateCertificate(body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke or delete a certificate (Admin only)' })
  async deleteCertificate(@Param('id') id: string) {
    return this.certificatesService.deleteCertificate(id);
  }
}
