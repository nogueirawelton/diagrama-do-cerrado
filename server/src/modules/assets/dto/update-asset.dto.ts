import { IsNumber, Min } from 'class-validator';

export class UpdateAssetDto {
  @IsNumber()
  @Min(0, { message: 'O preço deve ser positivo' })
  price: number;

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
}
