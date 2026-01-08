import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { addHours, isAfter } from 'date-fns';
import { parseWallet } from 'src/common/utils/parse-wallet';
import {
  CurrentUser,
  type UserPayload,
} from '../auth/decorators/current-user.decorator';
import { AtGuard } from '../auth/guards/at.guard';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { SyncService } from './services/sync.service';
import { WalletsService } from './services/wallets.service';

@Controller('wallets')
export class WalletsController {
  constructor(
    private walletsService: WalletsService,
    private syncService: SyncService,
  ) {}

  @UseGuards(AtGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser() user: UserPayload,
    @Body() CreateWalletDto: CreateWalletDto,
  ) {
    const { sub } = user;

    return this.walletsService.create(sub, CreateWalletDto);
  }

  @UseGuards(AtGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@CurrentUser() user: UserPayload) {
    const { sub } = user;

    return this.walletsService.findAll(sub);
  }

  @UseGuards(AtGuard)
  @Get(':walletNumber')
  @HttpCode(HttpStatus.OK)
  async findByWalletNumber(
    @CurrentUser() user: UserPayload,
    @Param('walletNumber') walletNumber: number,
  ) {
    const { sub } = user;

    const wallet = await this.walletsService.findByWalletNumber(
      sub,
      walletNumber,
    );

    const needSync = isAfter(
      new Date(),
      addHours(new Date(wallet.lastExternalSyncAt), 12),
    );

    if (needSync) {
      const updatedWallet = await this.syncService.syncWallet(wallet);
      return parseWallet(updatedWallet);
    }

    return parseWallet(wallet);
  }
}
