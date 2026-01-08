import { IsNumber, MinLength } from 'class-validator';

export class CreateWalletDto {
  @MinLength(3, { message: 'O nome precisa ter no mínimo 3 caracteres' })
  name: string;

  @IsNumber({}, { message: 'Insira o ID da sua carteira no I10' })
  walletNumber: number;
}
