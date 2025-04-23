import { Module } from '@nestjs/common';
import { PayableController } from './payable.controller';
import { PayableService } from './payable.service';
import { PayableRepository } from './payable.repository';
import { PrismaService } from 'src/prisma.service';
import { AssignorModule } from 'src/assignor/assignor.module';

@Module({
  imports: [AssignorModule], // Importando o AssignorModule para usar o AssignorService
  controllers: [PayableController],
  providers: [PayableService, PayableRepository, PrismaService],
})
export class PayableModule {}
