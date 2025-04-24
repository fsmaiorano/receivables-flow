import { Test, TestingModule } from '@nestjs/testing';
import { PayableService } from './payable.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payable } from './domain/entities/payable.entity';
import { Repository } from 'typeorm';
import { AssignorService } from '../assignor/assignor.service';

describe('PayableService', () => {
  let service: PayableService;
  let repository: Repository<Payable>;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockAssignorService = {
    verifyExists: jest.fn(),
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
      ],
    }).compile();

    service = module.get<PayableService>(PayableService);
    repository = module.get<Repository<Payable>>(getRepositoryToken(Payable));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
