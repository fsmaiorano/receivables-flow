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
        value: 100,
        emissionDate: new Date(),
        assignorId: 'abc',
      };

      jest
        .spyOn(prismaService.payable, 'findUnique')
        .mockResolvedValue(mockPayable);

      const result = await payableRepository.getPayableDetails(id);

      expect(result).toEqual(mockPayable);
    });

    it('should throw NotFoundException if payable not found', async () => {
      const id = '123';

      jest.spyOn(prismaService.payable, 'findUnique').mockResolvedValue(null);

      await expect(payableRepository.getPayableDetails(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
