import { Test, TestingModule } from '@nestjs/testing';
import { PayableController } from './payable.controller';
import { PayableService } from './payable.service';
import { PayableRepository } from './payable.repository';

describe('PayableController', () => {
  let controller: PayableController;

  const mockPayableRepository = {
    getPayableDetails: jest.fn(),
  };

  const mockPayableService = {
    getPayableDetails: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayableController],
      providers: [
        {
          provide: PayableService,
          useValue: mockPayableService,
        },
        {
          provide: PayableRepository,
          useValue: mockPayableRepository,
        },
      ],
    }).compile();

    controller = module.get<PayableController>(PayableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
