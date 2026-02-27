import { Module } from '@nestjs/common';
import { WalletsModule } from '../wallets/wallets.module';
import { ContributionController } from './contribution.controller';
import { ContributionService } from './contribution.service';

@Module({
  imports: [WalletsModule],
  controllers: [ContributionController],
  providers: [ContributionService],
})
export class ContributionModule {}
