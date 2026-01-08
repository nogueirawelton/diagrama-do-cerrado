import { CategoryTarget } from 'src/modules/wallets/entities/category-target.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Asset } from './asset.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  apiReference: string;

  @Column({ unique: true })
  name: string;

  @Column()
  icon: string;

  @OneToMany(() => Asset, (asset) => asset.category)
  assets: Array<Asset>;

  @OneToMany(() => CategoryTarget, (target) => target.category)
  targets: Array<CategoryTarget>;
}
