import { AssignorService } from './assignor.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateAssignorRequest } from './dtos/create-assignor.request';

@Controller('assignor')
export class AssignorController {
  constructor(private assignorService: AssignorService) {}

  @Post('')
  createAssignor(@Body() createAssignorRequest: CreateAssignorRequest) {
    return this.assignorService.createAssignor(createAssignorRequest);
  }

  @Get('/integrations/assignor/:id')
  getAssignorById(@Param('id') id: string) {
    return this.assignorService.verifyExists({
      assignorId: id,
    });
  }
}
