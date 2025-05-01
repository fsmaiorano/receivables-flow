import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { CorrelationIdService } from '../shared/services/correlation-id.service';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  constructor(private correlationIdService: CorrelationIdService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const correlationId =
      (req.headers['x-correlation-id'] as string) || randomUUID();

    req['correlationId'] = correlationId;

    // Store in our service for access throughout the application

    res.setHeader('x-correlation-id', correlationId);

    console.log(
      `Request ${req.method} ${req.url} assigned correlation ID: ${correlationId}`,
    );

    next();
  }
}
