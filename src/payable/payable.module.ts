import { Module } from '@nestjs/common';
import { PayableController } from './payable.controller';
import { PayableService } from './payable.service';
import { SharedModule } from '../shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payable } from './domain/entities/payable.entity';
import { AssignorModule } from '../assignor/assignor.module';
import { PayableMessaging } from './payable.messaging';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Payable]), AssignorModule],
  controllers: [PayableController, PayableMessaging],
  providers: [PayableService],
  exports: [PayableService],
})
export class PayableModule {}
