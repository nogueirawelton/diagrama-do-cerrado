import { MinLength } from 'class-validator';

export class CreateWalletDto {
  @MinLength(3, { message: 'O nome precisa ter no mínimo 3 caracteres' })
  name: string;

  @MinLength(3, { message: 'Insira o ID da sua carteira no I10' })
  walletNumber: string;
}
