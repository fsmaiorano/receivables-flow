import { AssignorService } from './assignor.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateAssignorRequest } from './dtos/create-assignor.request';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { PaginationRequestDto } from 'src/shared/dto/pagination.request';

@ApiTags('Assignor')
@ApiBearerAuth('access-token')
@Controller('Integrations')
export class AssignorController {
  constructor(private assignorService: AssignorService) {}

  @Post('assignor')
  @UseGuards(JwtAuthGuard)
  createAssignor(@Body() createAssignorRequest: CreateAssignorRequest) {
    return this.assignorService.createAssignor(createAssignorRequest);
  }

  @Put('assignor/:id')
  @UseGuards(JwtAuthGuard)
  updateAssignor(
    @Param('id') id: string,
    @Body() createAssignorRequest: CreateAssignorRequest,
  ) {
    return this.assignorService.updateAssignor(id, createAssignorRequest);
  }

  @Delete('assignor/:id')
  @UseGuards(JwtAuthGuard)
  deleteAssignor(@Param('id') id: string) {
    return this.assignorService.deleteAssignor(id);
  }

  @Get('assignor/:id')
  @UseGuards(JwtAuthGuard)
  getAssignorById(@Param('id') id: string) {
    return this.assignorService.getAssignorById(id);
  }

  @Get('assignor')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all assignors with pagination support' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (zero-based)',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    type: String,
    description: 'Filter text to search for in name or email',
  })
  getAllAssignors(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('filter') filter?: string,
  ) {
    const paginationOptions: PaginationRequestDto = {
      page: page !== undefined ? Number(page) : 0,
      pageSize: pageSize !== undefined ? Number(pageSize) : 10,
      filter: filter || '',
    };

    return this.assignorService.getAllAssignors(paginationOptions, filter);
  }
}
