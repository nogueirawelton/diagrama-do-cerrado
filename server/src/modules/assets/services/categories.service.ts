import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  findByApiReference(apiReference: string) {
    return this.categoriesRepository.findOneBy({
      apiReference,
    });
  }

  findAll() {
    return this.categoriesRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }
}
