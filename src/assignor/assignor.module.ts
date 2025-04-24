import { Module } from '@nestjs/common';
import { AssignorController } from './assignor.controller';
import { AssignorService } from './assignor.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [AssignorController],
  providers: [AssignorService],
  exports: [AssignorService],
})
export class AssignorModule {}
