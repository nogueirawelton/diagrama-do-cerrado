import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './controllers/categories.controller';
import { Asset } from './entities/asset.entity';
import { Category } from './entities/category.entity';
import { AssetsService } from './services/assets.service';
import { CategoriesService } from './services/categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Asset])],
  controllers: [CategoriesController],
  providers: [CategoriesService, AssetsService],
  exports: [AssetsService],
})
export class AssetsModule {}
