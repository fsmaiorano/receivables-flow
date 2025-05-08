import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
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
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { CreatePayableBatchRequest } from './dtos/create-payable-batch.request';
import { CreatePayableBatchResponse } from './dtos/create-payable-batch.response';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationRequestDto } from '../shared/dto/pagination.request';
import { Result } from 'src/shared/dto/result.generic';

@ApiTags('Payable')
@ApiBearerAuth('access-token')
@Controller('Integrations')
export class PayableController {
  constructor(private payableService: PayableService) {}

  @Get('payable')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all payables with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'filter', required: false, type: String })
  async getAllPayables(@Query() query: PaginationRequestDto) {
    const page = query.page || 0;
    const pageSize = query.pageSize || 10;
    const filter = query.filter || '';

    return this.payableService.getAllPayables({ page, pageSize, filter });
  }

  @Post('payable')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new payable' })
  async createPayable(
    @Body() createPayableRequest: CreatePayableRequest,
  ): Promise<Result<CreatePayableResponse>> {
    const payable =
      await this.payableService.createPayable(createPayableRequest);

    return payable;
  }

  @Get('payable/:id')
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

  @Put('payable/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a payable' })
  async updatePayable(
    @Param('id') id: string,
    @Body() updatePayableRequest: CreatePayableRequest,
  ) {
    return this.payableService.updatePayable(id, updatePayableRequest);
  }

  @Delete('payable/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a payable' })
  async deletePayable(@Param('id') id: string) {
    return this.payableService.deletePayable(id);
  }

  @Post('payable/batch')
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

  @Post('payable/batch/csv')
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
