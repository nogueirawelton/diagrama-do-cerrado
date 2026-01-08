import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { cerradoDiagram } from 'src/common/utils/cerrado-diagram';
import { getDollarRate } from 'src/common/utils/get-dollar-rate';
import {
  CurrentUser,
  type UserPayload,
} from '../auth/decorators/current-user.decorator';
import { AtGuard } from '../auth/guards/at.guard';
import { WalletsService } from '../wallets/services/wallets.service';
import { CreateContributionDto } from './dto/create-contribution.dto';

@Controller('contributions')
export class ContributionController {
  constructor(private walletsService: WalletsService) {}

  @UseGuards(AtGuard)
  @Post(':walletNumber')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: UserPayload,
    @Param('walletNumber') walletNumber: number,
    @Body() createContributionDto: CreateContributionDto,
  ) {
    const { sub } = user;

    const wallet = await this.walletsService.findByWalletNumber(
      sub,
      walletNumber,
    );

    const rate = await getDollarRate();

    return cerradoDiagram(createContributionDto.totalAmount, wallet, rate);
  }
}
