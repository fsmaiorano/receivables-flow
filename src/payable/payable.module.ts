import { Module } from '@nestjs/common';
import { PayableController } from './payable.controller';
import { PayableService } from './payable.service';
import { PrismaService } from '../prisma.service';
import { AssignorModule } from '../assignor/assignor.module';

@Module({
  imports: [AssignorModule],
  controllers: [PayableController],
  providers: [PayableService, PrismaService],
})
export class PayableModule {}
