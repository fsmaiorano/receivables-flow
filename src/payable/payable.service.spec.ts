import { Test, TestingModule } from '@nestjs/testing';
import { PayableService } from './payable.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payable } from './domain/entities/payable.entity';
import { AssignorService } from '../assignor/assignor.service';
import { ClientProxy } from '@nestjs/microservices';
import { CorrelationIdService } from '../shared/services/correlation-id.service';

describe('PayableService', () => {
  let service: PayableService;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockAssignorService = {
    verifyExists: jest.fn(),
  };

  const mockCorrelationIdService = {
    getCorrelationId: jest.fn().mockReturnValue('test-correlation-id'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayableService,
        {
          provide: getRepositoryToken(Payable),
          useValue: mockRepository,
        },
        {
          provide: AssignorService,
          useValue: mockAssignorService,
        },
        {
          provide: ClientProxy,
          useValue: {
            emit: jest.fn(),
            send: jest.fn().mockReturnValue({
              pipe: jest.fn().mockReturnValue({
                toPromise: jest.fn().mockResolvedValue({}),
              }),
            }),
          },
        },
        {
          provide: CorrelationIdService,
          useValue: mockCorrelationIdService,
        },
      ],
    }).compile();

    service = module.get<PayableService>(PayableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
