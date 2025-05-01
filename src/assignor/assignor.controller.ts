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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateAssignorRequest } from './dtos/create-assignor.request';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@ApiTags('Assignor')
@ApiBearerAuth('access-token')
@Controller('assignor')
export class AssignorController {
  constructor(private assignorService: AssignorService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  createAssignor(@Body() createAssignorRequest: CreateAssignorRequest) {
    return this.assignorService.createAssignor(createAssignorRequest);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateAssignor(
    @Param('id') id: string,
    @Body() createAssignorRequest: CreateAssignorRequest,
  ) {
    return this.assignorService.updateAssignor(id, createAssignorRequest);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteAssignor(@Param('id') id: string) {
    return this.assignorService.deleteAssignor(id);
  }

  @Get('/integrations/assignor/:id')
  @UseGuards(JwtAuthGuard)
  getAssignorById(@Param('id') id: string) {
    return this.assignorService.getAssignorById(id);
  }

  @Get('/integrations/assignor')
  @UseGuards(JwtAuthGuard)
  getAllAssignors() {
    return this.assignorService.getAllAssignors();
  }
}
