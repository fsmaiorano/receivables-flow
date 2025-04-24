import { Module } from '@nestjs/common';
import { AssignorModule } from './assignor/assignor.module';
import { SharedModule } from './shared/shared.module';
import { PayableModule } from './payable/payable.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PayableModule,
    SharedModule,
    AssignorModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
