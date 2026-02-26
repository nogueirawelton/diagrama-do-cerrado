import { CategoryTarget } from 'src/modules/wallets/entities/category-target.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Asset } from './asset.entity';

@Entity('categories')
export class Category {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Asset, (asset) => asset.category)
  assets: Array<Asset>;

  @OneToMany(() => CategoryTarget, (target) => target.category)
  targets: Array<CategoryTarget>;
}
