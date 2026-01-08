import { IsNumber, Min } from 'class-validator';

export class CreateContributionDto {
  @IsNumber()
  @Min(10, { message: 'O Valor precisa ser maior que 10' })
  totalAmount: number;
}
