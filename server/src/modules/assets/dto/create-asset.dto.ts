import { IsNumber, Min, MinLength } from 'class-validator';
import { Category } from '../entities/category.entity';

export class CreateAssetDto {
  @MinLength(2, { message: 'Ticker inválido' })
  ticker: string;

  @IsNumber()
  @Min(0, { message: 'O preço deve ser positivo' })
  price: number;

  @MinLength(1, { message: 'Moeda inválida' })
  currency: string;

  payout: number | null;
  pl: number | null;
  pvp: number | null;
  dy: number | null;
  roe: number | null;
  net_margin: number | null;
  gross_margin: number | null;
  gnr: number | null;
  gnp: number | null;
  vacancy: number | null;

  category: Category;
}
