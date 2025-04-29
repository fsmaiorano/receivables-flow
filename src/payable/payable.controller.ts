import {
  Controller,
  Get,
  Param,
  Post,
  NotFoundException,
  Body,
  UseGuards,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PayableService } from './payable.service';
import { CreatePayableRequest } from './dtos/create-payable.request';
import { CreatePayableResponse } from './dtos/create-payable.response';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { CreatePayableBatchRequest } from './dtos/create-payable-batch.request';
import { CreatePayableBatchResponse } from './dtos/create-payable-batch.response';
import { FileInterceptor } from '@nestjs/platform-express';

import { DeduplicationService } from '../shared/services/deduplication.service';

@ApiTags('Payable')
@ApiBearerAuth('access-token')
@Controller('payable')
export class PayableController {
  constructor(
    private payableService: PayableService,
    private deduplicationService: DeduplicationService,
  ) {}

  @Post('/integrations/payable')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new payable' })
  async createPayable(
    @Body() createPayableRequest: CreatePayableRequest,
  ): Promise<CreatePayableResponse> {
    const payable =
      await this.payableService.createPayable(createPayableRequest);

    return {
      id: payable.id,
      value: payable.value,
      emissionDate: payable.emissionDate,
      assignorId: payable.assignorId,
      createdAt: payable.createdAt,
      updatedAt: payable.updatedAt,
    };
  }

  @Get('/integrations/payable/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get payable by ID' })
  async getPayableById(@Param('id') id: string) {
    try {
      const result = await this.payableService.getById(id);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  @Post('/integrations/payable/batch')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a batch of payables from JSON' })
  async createBatchPayable(
    @Body() createPayableBatchRequest: CreatePayableBatchRequest,
  ): Promise<CreatePayableBatchResponse[]> {
    const payables = await this.payableService.createBatchPayable(
      createPayableBatchRequest,
    );
    return payables;
  }

  @Post('/integrations/payable/batch/csv')
  // @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create a batch of payables from CSV file',
    description:
      'Upload a CSV file with payable data to create multiple payables at once',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'CSV file containing payable data',
        },
      },
      required: ['file'],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async createBatchPayableFromCsv(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CreatePayableBatchResponse[]> {
    if (!file) {
      throw new BadRequestException('CSV file is required');
    }

    const fileExtension = file.originalname.split('.').pop();

    if (fileExtension !== 'csv') {
      throw new BadRequestException(
        'Invalid file type. Only CSV files are allowed',
      );
    }

    const payables = await this.payableService.createBatchPayableFromCsv(
      file.buffer,
    );
    return payables;
  }
}
