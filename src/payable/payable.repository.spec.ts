import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PayableRepository } from './payable.repository';

describe('PayableRepository', () => {
  let payableRepository: PayableRepository;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = new PrismaService();
    payableRepository = new PayableRepository(prismaService);
  });

  describe('getPayableDetails', () => {
    it('should return payable details if found', async () => {
      const id = '123';
      const mockPayable = {
        id: '123',
        value: 100 as any, // Cast to any to bypass Decimal type check
        emissionDate: new Date(),
        assignorId: 'abc',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prismaService.payable, 'findUnique')
        .mockResolvedValue(mockPayable);

      const result = await payableRepository.getById(id);

      expect(result).toEqual(mockPayable);
    });

    it('should throw NotFoundException if payable not found', async () => {
      const id = '123';

      jest.spyOn(prismaService.payable, 'findUnique').mockResolvedValue(null);

      await expect(payableRepository.getById(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
