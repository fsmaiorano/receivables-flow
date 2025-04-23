import { Test, TestingModule } from '@nestjs/testing';
import { AssignorController } from './assignor.controller';
import { AssignorService } from './assignor.service';

describe('AssignorController', () => {
  let controller: AssignorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignorController],
      providers: [
        {
          provide: AssignorService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AssignorController>(AssignorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
