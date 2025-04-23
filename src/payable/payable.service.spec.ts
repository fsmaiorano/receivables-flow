import { TestingModule, Test } from '@nestjs/testing';
import { AssignorService } from '../assignor/assignor.service';
import { PayableService } from './payable.service';
import { PayableRepository } from './payable.repository';

describe('PayableService', () => {
  let service: PayableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayableService,
        {
          provide: PayableRepository,
          useValue: {
            create: jest.fn(),
            getById: jest.fn(),
          },
        },
        {
          provide: AssignorService,
          useValue: {
            verifyExists: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PayableService>(PayableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
