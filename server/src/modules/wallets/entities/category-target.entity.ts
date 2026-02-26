import { Category } from 'src/modules/assets/entities/category.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Wallet } from './wallet.entity';

@Entity('category_target')
@Unique(['wallet', 'category'])
export class CategoryTarget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  targetPercentage: number;

  @ManyToOne(() => Wallet, (wallet) => wallet.targets)
  wallet: Wallet;

  @ManyToOne(() => Category, (category) => category.targets)
  category: Category;
}
