import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class TargetDto {
  @IsNumber()
  id: number;

  @IsNumber()
  @Min(0, { message: 'A porcentagem mínima é 0' })
  @Max(100, { message: 'A porcentagem máxima é 100' })
  percentage: number;
}
export class CreateWalletDto {
  @MinLength(3, { message: 'O nome precisa ter no mínimo 3 caracteres' })
  name: string;

  @MinLength(3, { message: 'Insira o ID da sua carteira no I10' })
  walletNumber: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'A carteira deve ter pelo menos um objetivo' })
  @ValidateNested({ each: true })
  @Type(() => TargetDto)
  targets: Array<TargetDto>;
}
