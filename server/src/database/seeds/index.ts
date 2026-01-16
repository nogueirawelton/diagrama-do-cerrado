// src/database/seeds/main-seeder.ts
import { AppDataSource } from '../data-source';
import { seedCategories } from './defaults/categories';

const runSeeds = async () => {
  try {
    await AppDataSource.initialize();

    await seedCategories(AppDataSource);

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Erro ao rodar seeds:', error);
    process.exit(1);
  }
};

runSeeds();
