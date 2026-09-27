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
import { BatchesService } from './batches.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Batches')
@Controller('batches')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'TRAINER')
  @ApiOperation({ summary: 'Get batches (Trainers see assigned only, Admin sees all)' })
  async getBatches(@CurrentUser() user: { id: string; role: string }) {
    return this.batchesService.findAll(user);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'TRAINER')
  @ApiOperation({ summary: 'Get single batch details' })
  async getBatch(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.batchesService.findOne(id, user);
  }

  @Post()
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Create a new cohort batch (Admin only)' })
  async createBatch(
    @Body() data: any,
    @CurrentUser('id') adminId: string,
  ) {
    return this.batchesService.create(data, adminId);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN', 'TRAINER')
  @ApiOperation({ summary: 'Update batch' })
  async updateBatch(
    @Param('id') id: string,
    @Body() data: any,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.batchesService.update(id, data, user);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete cohort batch (Admin only)' })
  async deleteBatch(
    @Param('id') id: string,
  ) {
    return this.batchesService.delete(id);
  }
}
