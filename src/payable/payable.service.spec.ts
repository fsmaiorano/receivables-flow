import { TestingModule, Test } from '@nestjs/testing';
import { AssignorService } from '../assignor/assignor.service';
import { PayableService } from './payable.service';
import { PayableRepository } from './payable.repository';
import Decimal from 'decimal.js';

describe('PayableService', () => {
  let service: PayableService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
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

  it('should create a payable', async () => {
    const assignorService = module.get<AssignorService>(AssignorService);
    jest.spyOn(assignorService, 'verifyExists').mockResolvedValue(true);

    const payableRepository = module.get<PayableRepository>(PayableRepository);
    jest.spyOn(payableRepository, 'create').mockResolvedValue({
      id: '1',
      value: new Decimal(100),
      assignorId: '123',
      emissionDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const createPayableRequest = {
      assignorId: '123',
      value: new Decimal(100),
      emissionDate: new Date(),
    };

    const result = await service.createPayable(createPayableRequest);

    expect(result).toEqual({
      id: '1',
      ...createPayableRequest,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });

    expect(assignorService.verifyExists).toHaveBeenCalledWith(
      createPayableRequest.assignorId,
    );
    expect(payableRepository.create).toHaveBeenCalled();
  });
});
