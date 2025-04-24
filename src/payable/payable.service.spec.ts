import { TestingModule, Test } from '@nestjs/testing';
import { AssignorService } from '../assignor/assignor.service';
import { PayableService } from './payable.service';
import Decimal from 'decimal.js';
import { PayableMapper } from './infrastructure/mappers/payable.mapper';
import { PrismaService } from '../shared/prisma.service';

jest.mock('./infrastructure/mappers/payable.mapper');

describe('PayableService', () => {
  let service: PayableService;
  let module: TestingModule;
  let prismaService: PrismaService;
  let assignorService: AssignorService;

  const mockAssignor = {
    id: '123',
    document: '12345678901',
    email: 'test@example.com',
    phone: '1234567890',
    name: 'Test Assignor',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        PayableService,
        {
          provide: PrismaService,
          useValue: {
            assignor: {
              findUnique: jest.fn().mockResolvedValue(mockAssignor),
              findFirst: jest.fn().mockResolvedValue(mockAssignor),
              create: jest.fn().mockResolvedValue(mockAssignor),
            },
            payable: {
              create: jest.fn().mockImplementation(({ data }) => ({
                id: '1',
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
              })),
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: AssignorService,
          useValue: {
            verifyExists: jest.fn().mockResolvedValue(mockAssignor),
            getAssignorById: jest.fn().mockResolvedValue(mockAssignor),
          },
        },
      ],
    }).compile();

    service = module.get<PayableService>(PayableService);
    prismaService = module.get<PrismaService>(PrismaService);
    assignorService = module.get<AssignorService>(AssignorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  it('should create a payable', async () => {
    const mockPayable = {
      id: '1',
      value: new Decimal(100),
      assignorId: '123',
      emissionDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (PayableMapper.toPersistence as jest.Mock).mockReturnValue({
      value: new Decimal(100),
      assignorId: '123',
      emissionDate: new Date(),
    });

    const createPayableRequest = {
      assignorId: '123',
      value: new Decimal(100),
      emissionDate: new Date(),
    };

    // Ensure the assignor service returns the mock assignor
    (assignorService.verifyExists as jest.Mock).mockResolvedValue(mockAssignor);
    (prismaService.payable.create as jest.Mock).mockResolvedValue(mockPayable);

    const result = await service.createPayable(createPayableRequest);

    expect(result).toEqual(mockPayable);

    expect(assignorService.verifyExists).toHaveBeenCalledWith({
      assignorId: createPayableRequest.assignorId,
    });
    expect(PayableMapper.toPersistence).toHaveBeenCalledWith(
      createPayableRequest,
    );
    expect(prismaService.payable.create).toHaveBeenCalled();
  });
});
