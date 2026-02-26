import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addHours, isAfter } from 'date-fns';
import { Asset } from 'src/modules/assets/entities/asset.entity';
import { Category } from 'src/modules/assets/entities/category.entity';
import { UsersService } from 'src/modules/users/users.service';
import { Repository } from 'typeorm';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { UpdateWalletPositionRateDto } from '../dto/update-wallet-position-rate.dto';
import { CategoryBalance } from '../entities/category-balance.entity';
import { CategoryTarget } from '../entities/category-target.entity';
import { WalletPosition } from '../entities/wallet-position.entity';
import { Wallet } from '../entities/wallet.entity';
import { I10Service } from './i10.service';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(WalletPosition)
    private walletPositionRepository: Repository<WalletPosition>,

    private i10Service: I10Service,
    private usersService: UsersService,
  ) {}

  async create(userId: number, createWalletDto: CreateWalletDto) {
    try {
      const wallet = this.walletRepository.create({
        ...createWalletDto,
        user: {
          id: userId,
        },
      });

      const createdWallet = await this.walletRepository.save(wallet);
      this.usersService.updateLastOpenedWallet(userId, createdWallet);

      return this.performSync(createdWallet);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Wallet já cadastrada com este número.');
      }

      console.log(error);
      throw error;
    }
  }

  findAll(userId: number) {
    return this.walletRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async findByWalletNumber(userId: number, walletNumber: string) {
    const wallet = await this.walletRepository.findOne({
      where: {
        user: { id: userId },
        walletNumber: walletNumber,
      },

      relations: {
        targets: {
          category: true,
        },
        categoryBalances: {
          category: true,
        },
        positions: {
          asset: {
            category: true,
          },
        },
      },
    });

    if (!wallet) {
      throw new NotFoundException('Carteira não encontrada.');
    }

    this.usersService.updateLastOpenedWallet(userId, wallet);

    return await this.performSync(wallet);
  }

  async performSync(wallet: Wallet) {
    const needSync = isAfter(
      new Date(),
      addHours(new Date(wallet.lastExternalSyncAt), 4),
    );

    if (!needSync) {
      return wallet;
    }

    const [rawInfo, rawMetrics, rawBalance, history] = await Promise.all([
      this.i10Service.getInfo(wallet.walletNumber),
      this.i10Service.getMetrics(wallet.walletNumber),
      this.i10Service.getBalance(wallet.walletNumber),
      this.i10Service.getHistory(wallet.walletNumber),
    ]);

    const updatedPositions = await Promise.all(
      rawInfo.tickers.map(async (ticker: any) => {
        const position = await this.i10Service.getPosition(
          wallet.walletNumber,
          ticker.type,
        );

        return { categoryId: ticker.type, positions: position.data };
      }),
    );

    const categories = rawInfo.tickers.map((ticker: any) => ({
      id: ticker.type,
      name: ticker.class,
    }));

    const targets = rawInfo.tickers.map((ticker: any) => ({
      wallet: { id: wallet.id },
      category: { id: ticker.type },
      targetPercentage: ticker.balancing,
    }));

    const balances = rawBalance.map((balance: any) => ({
      wallet: { id: wallet.id },
      category: { id: balance.type },
      value: balance.value,
      percent: balance.percent,
    }));

    const assets = updatedPositions.flatMap((data) =>
      data.positions.map((asset: any) => ({
        ticker: asset.ticker_name,
        price: asset.current_price,
        currency: asset.currency,
        payout: asset.payout || null,
        pl: asset.p_l || null,
        pvp: asset.p_vp || null,
        dy: asset.dy || null,
        roe: asset.roe || null,
        net_margin: asset.net_margin || null,
        gross_margin: asset.gross_margin || null,
        gnr: asset.gnr || null,
        gnp: asset.gnp || null,
        vacancy: asset.vacancy || null,
        updatedAt: new Date(),
        url: asset.url || null,
        category: { id: data.categoryId },
      })),
    );

    const updatedWallet = {
      applied: rawMetrics.applied,
      equity: rawMetrics.equity,
      variation: rawMetrics.variation,
      profit: rawMetrics.profit_twr,
      payments_12_months: rawMetrics.payments_12_months,
      variation_payments_12_months: rawMetrics.variation_payments_12_months,
      payments_total: rawMetrics.payments_total,
      provisioned: rawMetrics.provisioned,
      history,
      lastExternalSyncAt: new Date(),
    };

    const positions = updatedPositions.flatMap((data) =>
      data.positions.map((asset: any) => ({
        quantity: asset.quantity,
        averagePrice: asset.avg_price,
        appreciation: asset.appreciation,
        weightedReturn: asset.weighted_return,
        percentWallet: asset.percent_wallet,
        equityTotal: asset.equity_total,
        equityBrl: asset.equity_brl,
        yoc: asset.yoc || null,
        wallet: { id: wallet.id },
        asset: { ticker: asset.ticker_name },
      })),
    );

    return await this.walletRepository.manager.transaction(async (manager) => {
      await Promise.all([
        manager.delete(CategoryBalance, { wallet: { id: wallet.id } }),
        manager.delete(WalletPosition, { wallet: { id: wallet.id } }),
      ]);

      await Promise.all([
        manager.upsert(Category, categories, {
          conflictPaths: ['id'],
          skipUpdateIfNoValuesChanged: true,
        }),

        manager.upsert(CategoryTarget, targets, {
          conflictPaths: ['wallet', 'category'],
          skipUpdateIfNoValuesChanged: true,
        }),

        manager.upsert(CategoryBalance, balances, {
          conflictPaths: ['wallet', 'category'],
          skipUpdateIfNoValuesChanged: true,
        }),

        manager.upsert(Asset, assets, {
          conflictPaths: ['ticker'],
          skipUpdateIfNoValuesChanged: true,
        }),

        manager.update(Wallet, wallet.id, updatedWallet),
      ]);

      await Promise.all([
        manager.save(CategoryBalance, balances),
        manager.save(WalletPosition, positions),
      ]);

      return await manager.findOne(Wallet, {
        where: { id: wallet.id },
        relations: {
          targets: {
            category: true,
          },
          categoryBalances: {
            category: true,
          },
          positions: {
            asset: {
              category: true,
            },
          },
        },
      });
    });
  }

  async updateWalletPositionRate(
    userId: number,
    positionId: number,
    updateWalletPositionRateDto: UpdateWalletPositionRateDto,
  ) {
    const position = await this.walletPositionRepository.findOne({
      where: {
        id: positionId,
      },
      relations: {
        wallet: true,
      },
    });

    if (!position) {
      throw new NotFoundException('Posição não encontrada.');
    }

    const wallet = await this.findByWalletNumber(
      userId,
      position.wallet.walletNumber,
    );

    if (!wallet) {
      throw new NotFoundException('Carteira não encontrada.');
    }

    position.rate = updateWalletPositionRateDto.rate;

    await this.walletPositionRepository.save(position);

    return wallet;
  }
}
