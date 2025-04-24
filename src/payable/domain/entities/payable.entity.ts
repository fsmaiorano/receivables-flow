import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Assignor } from '../../../assignor/domain/entities/assignor.entity';

@Entity()
export class Payable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, unique: true })
  value: number;

  @Column({ type: 'datetime' })
  emissionDate: Date;

  @ManyToOne(() => Assignor, (assignor) => assignor.payables)
  @JoinColumn({ name: 'assignorId' })
  assignor: Assignor;

  @Column()
  assignorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
