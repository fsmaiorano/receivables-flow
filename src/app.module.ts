import { Module } from '@nestjs/common';
import { AssignorModule } from './assignor/assignor.module';
import { SharedModule } from './shared/shared.module';
import { PayableModule } from './payable/payable.module';

@Module({
  imports: [PayableModule, SharedModule, AssignorModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
