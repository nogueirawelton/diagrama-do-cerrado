import { Category } from 'src/modules/assets/entities/category.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Wallet } from './wallet.entity';

@Entity('category_balance')
@Unique(['wallet', 'category'])
export class CategoryBalance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  value: number;

  @Column('decimal', { precision: 5, scale: 2 })
  percent: number;

  @ManyToOne(() => Wallet, (wallet) => wallet.categoryBalances)
  wallet: Wallet;

  @ManyToOne(() => Category)
  category: Category;
}
