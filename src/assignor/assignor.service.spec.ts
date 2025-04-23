import { Test, TestingModule } from '@nestjs/testing';
import { AssignorService } from './assignor.service';

const mockAssignorRepository = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('AssignorService', () => {
  let service: AssignorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignorService,
        {
          provide: 'AssignorRepository',
          useValue: mockAssignorRepository,
        },
      ],
    }).compile();

    service = module.get<AssignorService>(AssignorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
