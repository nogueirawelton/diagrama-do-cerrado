import { Module } from '@nestjs/common';
import { WalletsModule } from '../wallets/wallets.module';
import { ContributionController } from './contribution.controller';

@Module({
  imports: [WalletsModule],
  controllers: [ContributionController],
  providers: [],
})
export class ContributionModule {}
