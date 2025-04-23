import { PrismaService } from '../prisma.service';
import { AssignorRepository } from './assignor.repository';
import { CreateAssignorRequest } from './dtos/create-assignor.request';

describe('AssignorRepository', () => {
  let assignorRepository: AssignorRepository;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = new PrismaService();
    assignorRepository = new AssignorRepository(prismaService);
  });

  it('should be defined', () => {
    expect(assignorRepository).toBeDefined();
  });

  it('should create an assignor', async () => {
    const assignorData: CreateAssignorRequest = {
      document: '12345678900',
      email: 'assignor@example.com',
      phone: '+5511999999999',
      name: 'John Doe',
    };
    const result = await assignorRepository.create(assignorData);
    expect(result).toBeDefined();
  });

  it('should throw an error if assignor data is invalid', async () => {
    const invalidAssignorData: CreateAssignorRequest = {
      document: '',
      email: 'invalid-email',
      phone: 'not-a-phone',
      name: '',
    };
    await expect(
      assignorRepository.create(invalidAssignorData),
    ).rejects.toThrow();
  });
});
