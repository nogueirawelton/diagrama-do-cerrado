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
import { Category } from '../assets/entities/category.entity';
import {
  CurrentUser,
  type UserPayload,
} from '../auth/decorators/current-user.decorator';
import { AtGuard } from '../auth/guards/at.guard';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { WalletPosition } from './entities/wallet-position.entity';
import { WalletsService } from './services/wallets.service';

@Controller('wallets')
export class WalletsController {
  constructor(private walletsService: WalletsService) {}

  @UseGuards(AtGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: UserPayload,
    @Body() createWalletDto: CreateWalletDto,
  ) {
    const { sub } = user;

    const wallet = await this.walletsService.create(sub, createWalletDto);

    return wallet;
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
    @Param('walletNumber') walletNumber: string,
  ) {
    const { sub } = user;

    const wallet = await this.walletsService.findByWalletNumber(
      sub,
      walletNumber,
    );

    const categories = wallet?.positions.reduce(
      (
        acc: Array<Category & { positions: Array<WalletPosition> }>,
        position,
      ) => {
        const index = acc.findIndex(
          (item) => item.id == position.asset.category.id,
        );

        if (index === -1) {
          acc.push({
            ...position.asset.category,
            positions: [position],
          });
        } else {
          acc[index].positions.push(position);
        }

        return acc;
      },
      [],
    );

    return { ...wallet, categories };
  }
}
