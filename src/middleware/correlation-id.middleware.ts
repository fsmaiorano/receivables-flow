import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { CorrelationIdService } from '../shared/services/correlation-id.service';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  constructor(private correlationIdService: CorrelationIdService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Get correlation ID from headers or generate a new one
    const correlationId =
      (req.headers['x-correlation-id'] as string) || uuidv4();

    // Store in the request for potential use in controllers
    req['correlationId'] = correlationId;

    // Store in our service for access throughout the application
    this.correlationIdService.setCorrelationId(correlationId);

    // Set the response header so clients can track the correlation ID
    res.setHeader('x-correlation-id', correlationId);

    // For debugging
    console.log(
      `Request ${req.method} ${req.url} assigned correlation ID: ${correlationId}`,
    );

    next();
  }
}
