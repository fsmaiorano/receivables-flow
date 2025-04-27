import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule } from './database/database.module';

@Module({
  controllers: [],
  providers: [],
  exports: [DatabaseModule, ClientsModule],
  imports: [
    DatabaseModule,
    ClientsModule.register([
      {
        name: 'ReceivablesFlow',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${process.env.RABBITMQ_HOST || 'localhost'}:5672`], // Use environment variable
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
