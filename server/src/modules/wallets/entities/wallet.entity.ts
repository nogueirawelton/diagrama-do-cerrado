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

  @Column({ nullable: true })
  lastExternalSyncAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date | null;

  @ManyToOne(() => User, (user) => user.wallets)
  user: User;

  @OneToMany(() => CategoryTarget, (target) => target.wallet, {
    cascade: true,
  })
  targets: Array<CategoryTarget>;

  @OneToMany(() => WalletPosition, (position) => position.wallet)
  positions: Array<WalletPosition>;
}
