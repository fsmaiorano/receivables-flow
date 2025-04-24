import { Module } from '@nestjs/common';
import { PayableController } from './payable.controller';
import { PayableService } from './payable.service';
import { AssignorModule } from '../assignor/assignor.module';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [AssignorModule, SharedModule],
  controllers: [PayableController],
  providers: [PayableService],
})
export class PayableModule {}
