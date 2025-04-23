import { PrismaService } from '../prisma.service';
import { AssignorRepository } from './assignor.repository';
import { AssignorService } from './assignor.service';
import { CreateAssignorRequest } from './dtos/create-assignor.request';

describe('AssignorRepository', () => {
  let assignorService: AssignorService;
  let assignorRepository: AssignorRepository;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = {
      assignor: {
        create: jest.fn().mockResolvedValue({
          id: '1',
          document: '12345678900',
          email: 'assignor@example.com',
          phone: '+5511999999999',
          name: 'John Doe',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        findUnique: jest.fn().mockResolvedValue({
          id: '1',
          document: '12345678900',
          email: 'assignor@example.com',
          phone: '+5511999999999',
          name: 'John Doe',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      },
    } as unknown as PrismaService;

    assignorRepository = new AssignorRepository(prismaService);
    assignorService = new AssignorService(assignorRepository);
  });

  it('should be defined', () => {
    expect(assignorService).toBeDefined();
    expect(assignorRepository).toBeDefined();
  });

  it('should create an assignor successfully', async () => {
    const validAssignorData: CreateAssignorRequest = {
      document: '12345678900',
      email: 'assignor@example.com',
      phone: '+5511999999999',
      name: 'John Doe',
    };

    const result = await assignorRepository.create(validAssignorData);
    expect(result).toBeDefined();
  });

  it('should throw an error if assignor data is invalid', async () => {
    const invalidAssignorData: CreateAssignorRequest = {
      document: '',
      email: 'invalid-email',
      phone: 'not-a-phone',
      name: '',
    };

    jest
      .spyOn(prismaService.assignor, 'create')
      .mockRejectedValueOnce(new Error('Invalid data'));

    await expect(
      assignorRepository.create(invalidAssignorData),
    ).rejects.toThrow();
  });

  it('should find an assignor by ID', async () => {
    const assignorId = '1';
    const result = await assignorRepository.findById(assignorId);
    expect(result).toBeDefined();
    expect(result.id).toEqual(assignorId);
  });
});
