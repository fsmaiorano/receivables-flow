import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule } from './database/database.module';

@Module({
  controllers: [],
  providers: [],
  exports: [DatabaseModule],
  imports: [
    DatabaseModule,
    ClientsModule.register([
      {
        name: 'ReceivablesFlow',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'receivables_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
})
export class SharedModule {}
