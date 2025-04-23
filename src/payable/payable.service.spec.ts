import { Test, TestingModule } from '@nestjs/testing';
import { PayableService } from './payable.service';
import { PayableRepository } from './payable.repository';

describe('PayableService', () => {
  let service: PayableService;
  let mockPayableRepository: Partial<PayableRepository>;

  beforeEach(async () => {
    mockPayableRepository = {
      getById: jest.fn().mockResolvedValue({
        id: '123',
        value: 100,
        emissionDate: new Date(),
        assignorId: 'abc',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayableService,
        {
          provide: PayableRepository,
          useValue: mockPayableRepository,
        },
      ],
    }).compile();

    service = module.get<PayableService>(PayableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return payable details', async () => {
    const id = '123';
    const mockPayable = {
      id: '123',
      value: 100,
      emissionDate: new Date(),
      assignorId: 'abc',
    };

    jest
      .spyOn(mockPayableRepository, 'getPayableDetails')
      .mockResolvedValue(mockPayable);

    const result = await service.getPayableDetails(id);

    expect(mockPayableRepository.getById).toHaveBeenCalledWith(id);
    expect(result).toEqual(mockPayable);
  });
});
