import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Payable } from '../../generated/prisma';

@Injectable()
export class PayableRepository {
  constructor(private prismaService: PrismaService) {}

  async create(payableData: Omit<Payable, 'id' | 'createdAt' | 'updatedAt'>) {
    return await this.prismaService.payable.create({
      data: payableData,
    });
  }

  async getPayableDetails(id: string) {
    const payableDetails = await this.prismaService.payable.findUnique({
      where: { id },
    });

    if (!payableDetails) {
      throw new NotFoundException(`Payable with ID ${id} not found`);
    }

    return payableDetails;
  }
}
