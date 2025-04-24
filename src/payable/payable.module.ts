import { Module } from '@nestjs/common';
import { PayableController } from './payable.controller';
import { PayableService } from './payable.service';
import { SharedModule } from '../shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payable } from './domain/entities/payable.entity';
import { AssignorModule } from '../assignor/assignor.module';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Payable]), AssignorModule],
  controllers: [PayableController],
  providers: [PayableService],
  exports: [PayableService],
})
export class PayableModule {}
