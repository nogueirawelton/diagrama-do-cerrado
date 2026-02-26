import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryBalance } from './category-balance.entity';
import { CategoryTarget } from './category-target.entity';
import { WalletPosition } from './wallet-position.entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  walletNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  applied: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  equity: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, default: 0 })
  variation: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, default: 0 })
  profit: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  payments_12_months: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  variation_payments_12_months: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  payments_total: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  provisioned: number;

  @Column({ nullable: true })
  lastExternalSyncAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date | null;

  @ManyToOne(() => User, (user) => user.wallets)
  user: User;

  @OneToMany(() => CategoryTarget, (target) => target.wallet)
  targets: Array<CategoryTarget>;

  @OneToMany(() => CategoryBalance, (categoryBalance) => categoryBalance.wallet)
  categoryBalances: Array<CategoryBalance>;

  @Column({ type: 'jsonb', nullable: true })
  history: {
    date: string;
    sum_applied: number;
    sum_equity: number;
    profitability: number;
  }[];

  @OneToMany(() => WalletPosition, (position) => position.wallet)
  positions: Array<WalletPosition>;
}
