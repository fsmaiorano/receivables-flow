import { Test, TestingModule } from '@nestjs/testing';
import { AssignorService } from './assignor.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Assignor } from './domain/entities/assignor.entity';
import { Repository } from 'typeorm';

describe('AssignorService', () => {
  let service: AssignorService;
  let repository: Repository<Assignor>;

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignorService,
        {
          provide: getRepositoryToken(Assignor),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AssignorService>(AssignorService);
    repository = module.get<Repository<Assignor>>(getRepositoryToken(Assignor));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
