import { IsNumber, Min } from 'class-validator';

export class UpdatePositionDto {
  @IsNumber()
  @Min(1, { message: 'Deve haver pelo menos 1 ativo' })
  quantity: number;

  yoc: number | null;

  @IsNumber()
  averagePrice: number;
}
