import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Audit')
@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
@ApiBearerAuth()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('audit/logs')
  @ApiOperation({ summary: 'Get security audit logs (Admin only)' })
  async getLogs(
    @Query('action') action?: string,
    @Query('resourceType') resourceType?: string,
    @Query('limit') limit?: string,
  ) {
    return this.auditService.findAll({
      action,
      resourceType,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get security audit logs alias (Admin only)' })
  async getAuditLogsAlias(
    @Query('action') action?: string,
    @Query('resourceType') resourceType?: string,
    @Query('limit') limit?: string,
  ) {
    return this.auditService.findAll({
      action,
      resourceType,
      limit: limit ? parseInt(limit) : undefined,
    });
  }
}
