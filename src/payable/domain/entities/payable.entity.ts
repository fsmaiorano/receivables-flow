import Decimal from 'decimal.js';

export class PayableEntity {
  public id: string;
  public value: Decimal;
  public emissionDate: Date;
  public assignorId: string;
  public createdAt: Date;
  public updatedAt: Date;
}
