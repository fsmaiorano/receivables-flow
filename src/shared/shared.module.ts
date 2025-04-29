import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule } from './database/database.module';
import { DeduplicationService } from './services/deduplication.service';
import { CorrelationIdService } from './services/correlation-id.service';

@Module({
  controllers: [],
  providers: [DeduplicationService, CorrelationIdService],
  exports: [
    DatabaseModule,
    ClientsModule,
    DeduplicationService,
    CorrelationIdService,
  ],
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
            durable: true,
          },
        },
      },
    ]),
  ],
})
export class SharedModule {}
