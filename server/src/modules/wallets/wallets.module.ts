import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsModule } from '../assets/assets.module';
import { WalletPosition } from './entities/wallet-position.entity';
import { Wallet } from './entities/wallet.entity';
import { PositionsService } from './services/positions.service';
import { SyncService } from './services/sync.service';
import { WalletsService } from './services/wallets.service';
import { WalletsController } from './wallets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, WalletPosition]), AssetsModule],
  controllers: [WalletsController],
  providers: [WalletsService, PositionsService, SyncService],
  exports: [WalletsService],
})
export class WalletsModule {}
