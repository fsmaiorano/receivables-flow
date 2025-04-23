import { Module } from '@nestjs/common';
import { AssignorController } from './assignor.controller';
import { AssignorService } from './assignor.service';
import { PrismaService } from 'src/prisma.service';
import { AssignorRepository } from './assignor.repository';

@Module({
  controllers: [AssignorController],
  providers: [
    AssignorService,
    {
      provide: 'AssignorRepository',
      useClass: AssignorRepository,
    },
    PrismaService,
  ],
  exports: [AssignorService], // Exportando o serviço para ser usado por outros módulos
})
export class AssignorModule {}
