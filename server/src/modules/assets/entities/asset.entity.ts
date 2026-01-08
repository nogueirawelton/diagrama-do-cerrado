import { WalletPosition } from 'src/modules/wallets/entities/wallet-position.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  ticker: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  payout: number | null;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  pl: number | null;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  pvp: number | null;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  dy: number | null;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  roe: number | null;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  net_margin: number | null;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  gross_margin: number | null;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  gnr: number | null;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  gnp: number | null;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  vacancy: number | null;

  @Column()
  currency: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Category, (category) => category.assets)
  category: Category;

  @OneToMany(() => WalletPosition, (position) => position.asset)
  positions: Array<WalletPosition>;
}
