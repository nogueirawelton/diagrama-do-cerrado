import { Asset } from 'src/modules/assets/entities/asset.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity';

@Entity('wallet_position')
export class WalletPosition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 18, scale: 8 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  averagePrice: number;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  yoc: number | null;

  @Column({ default: 10, type: 'int', nullable: true })
  rate: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Wallet, (wallet) => wallet.positions)
  wallet: Wallet;

  @ManyToOne(() => Asset, (asset) => asset.positions)
  asset: Asset;
}
