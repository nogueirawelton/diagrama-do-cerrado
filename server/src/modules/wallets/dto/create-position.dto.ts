import { IsNumber, Min } from 'class-validator';
import { Asset } from 'src/modules/assets/entities/asset.entity';
import { Wallet } from '../entities/wallet.entity';

export class CreatePositionDto {
  @IsNumber()
  @Min(1, { message: 'Deve haver pelo menos 1 ativo' })
  quantity: number;

  @IsNumber()
  averagePrice: number;

  yoc: number | null;

  wallet: Wallet;
  asset: Asset;
}
