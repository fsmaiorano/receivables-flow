import {
  Controller,
  Get,
  Param,
  Post,
  NotFoundException,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PayableService } from './payable.service';
import { CreatePayableRequest } from './dtos/create-payable.request';
import { CreatePayableResponse } from './dtos/create-payable.response';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Payable')
@Controller('payable')
export class PayableController {
  constructor(private payableService: PayableService) {}

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
}
