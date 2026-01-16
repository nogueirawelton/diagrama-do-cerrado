import { Category } from 'src/modules/assets/entities/category.entity';
import { DataSource } from 'typeorm';

export const seedCategories = async (dataSource: DataSource) => {
  const repository = dataSource.getRepository(Category);

  const categoriesToInsert = [
    {
      apiReference: 'Ticker',
      name: 'Ações',
      icon: 'currency-dollar',
    },
    {
      apiReference: 'Fii',
      name: 'Fiis',
      icon: 'currency-dollar',
    },
    {
      apiReference: 'Crypto',
      name: 'Criptomoedas',
      icon: 'currency-dollar',
    },
    {
      apiReference: 'Etf',
      name: 'Etfs',
      icon: 'currency-dollar',
    },
    {
      apiReference: 'EtfInternational',
      name: 'Etfs Internacionais',
      icon: 'currency-dollar',
    },
    {
      apiReference: 'Stock',
      name: 'Stocks',
      icon: 'currency-dollar',
    },
    {
      apiReference: 'fixed',
      name: 'Renda Fixa',
      icon: 'currency-dollar',
    },
  ];

  console.log('🌱 Iniciando seed de integrações de API...');

  await repository.upsert(categoriesToInsert, ['apiReference']);

  console.log(
    `✅ ${categoriesToInsert.length} integrações processadas com sucesso.`,
  );
};
