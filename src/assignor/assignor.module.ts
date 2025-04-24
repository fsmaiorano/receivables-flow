import { Module } from '@nestjs/common';
import { AssignorController } from './assignor.controller';
import { AssignorService } from './assignor.service';
import { SharedModule } from '../shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignor } from './domain/entities/assignor.entity';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Assignor])],
  controllers: [AssignorController],
  providers: [AssignorService],
  exports: [AssignorService],
})
export class AssignorModule {}
