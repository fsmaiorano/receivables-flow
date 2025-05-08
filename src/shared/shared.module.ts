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
          urls: [`amqp://${process.env.RABBITMQ_HOST || 'localhost'}:5672`],
          queue: 'receivables_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: 'ReceivablesFlowRetry1',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${process.env.RABBITMQ_HOST || 'localhost'}:5672`],
          queue: 'receivables_queue_retry_1',
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: 'ReceivablesFlowRetry2',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${process.env.RABBITMQ_HOST || 'localhost'}:5672`],
          queue: 'receivables_queue_retry_2',
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: 'ReceivablesFlowRetry3',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${process.env.RABBITMQ_HOST || 'localhost'}:5672`],
          queue: 'receivables_queue_retry_3',
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: 'ReceivablesFlowRetry4',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${process.env.RABBITMQ_HOST || 'localhost'}:5672`],
          queue: 'receivables_queue_retry_4',
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: 'ReceivablesFlowDeadLetter',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${process.env.RABBITMQ_HOST || 'localhost'}:5672`],
          queue: 'receivables_queue_dead_letter',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
})
export class SharedModule {}
