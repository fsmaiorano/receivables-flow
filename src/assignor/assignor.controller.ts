import { AssignorService } from './assignor.service';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateAssignorRequest } from './dtos/create-assignor.request';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('assignor')
export class AssignorController {
  constructor(private assignorService: AssignorService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  createAssignor(@Body() createAssignorRequest: CreateAssignorRequest) {
    return this.assignorService.createAssignor(createAssignorRequest);
  }

  @Get('/integrations/assignor/:id')
  @UseGuards(JwtAuthGuard)
  getAssignorById(@Param('id') id: string) {
    return this.assignorService.verifyExists({
      assignorId: id,
    });
  }
}
