import { AssignorService } from './assignor.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('assignor')
export class AssignorController {
  constructor(private assignorService: AssignorService) {}

  @Get('/integrations/assignor/:id')
  getAssignorById(@Param('id') id: string) {
    console.log(id);
  }
}
