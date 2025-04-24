import { Test, TestingModule } from '@nestjs/testing';
import { PayableController } from './payable.controller';
import { PayableService } from './payable.service';

describe('PayableController', () => {
  let controller: PayableController;

  const mockPayableService = {
    getPayableDetails: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayableController],
      providers: [
        {
          provide: PayableService,
          useValue: mockPayableService,
        },
      ],
    }).compile();

    controller = module.get<PayableController>(PayableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
