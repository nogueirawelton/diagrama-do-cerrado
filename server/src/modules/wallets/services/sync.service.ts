import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { addHours, isAfter } from 'date-fns';
import { CreateAssetDto } from 'src/modules/assets/dto/create-asset.dto';
import { UpdateAssetDto } from 'src/modules/assets/dto/update-asset.dto';
import { Category } from 'src/modules/assets/entities/category.entity';
import { AssetsService } from 'src/modules/assets/services/assets.service';
import { CreatePositionDto } from '../dto/create-position.dto';
import { UpdatePositionDto } from '../dto/update-position.dto';
import { Wallet } from '../entities/wallet.entity';
import { PositionsService } from './positions.service';
import { WalletsService } from './wallets.service';

type ApiPosition = {
  category: Category;
  assets: Array<Record<string, any>>;
};

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  private readonly endpoint =
    'https://investidor10.com.br/wallet/api/proxy/wallet-app/summary/actives';

  constructor(
    private assetsService: AssetsService,
    private positionsService: PositionsService,
    private walletsService: WalletsService,
  ) {}

  async syncWallet(wallet: Wallet) {
    try {
      this.logger.log(
        `Iniciando importação para a carteira ${wallet.walletNumber}...`,
      );

      const updatedPosition: Array<ApiPosition> = await Promise.all(
        wallet.targets.map(async (target) => {
          const { data } = await axios.get(
            `${this.endpoint}/${wallet.walletNumber}/${target.category.apiReference}`,
          );

          return {
            category: target.category,
            assets: data.data,
          };
        }),
      );

      await Promise.all(
        updatedPosition.map(({ category, assets }) =>
          this.syncWalletPosition(wallet, category, assets),
        ),
      );

      return await this.walletsService.updateLastSyncDate(wallet.id);
    } catch (error) {
      this.logger.error(
        `Erro ao importar carteira ${wallet.walletNumber}: ${error.message}`,
      );
      throw error;
    }
  }

  private async syncWalletPosition(
    wallet: Wallet,
    category: Category,
    assets: Array<Record<string, any>>,
  ) {
    await Promise.all(
      assets.map(async (apiAsset) => {
        try {
          const asset = await this.syncAsset(apiAsset, category);

          const position = await this.positionsService.findByWalletAndAsset(
            wallet.id,
            asset.id,
          );

          if (position) {
            const updatePositionDto: UpdatePositionDto = {
              quantity: apiAsset.quantity,
              averagePrice: apiAsset.avg_price,
              yoc: apiAsset.yoc || null,
            };
            await this.positionsService.update(position.id, updatePositionDto);
          } else {
            const createPositionDto: CreatePositionDto = {
              wallet: wallet,
              asset: asset,
              quantity: apiAsset.quantity,
              averagePrice: apiAsset.avg_price,
              yoc: apiAsset.yoc || null,
            };

            await this.positionsService.create(createPositionDto);
          }
        } catch (error) {
          this.logger.error(
            `Erro ao sincronizar ativo ${apiAsset.ticker_name}: ${error.message}`,
          );
        }
      }),
    );
  }

  private async syncAsset(apiAsset: Record<string, any>, category: Category) {
    const asset = await this.assetsService.findByTicker(apiAsset.ticker_name);

    if (asset) {
      const needUpdate = isAfter(
        new Date(),
        addHours(new Date(asset.updatedAt), 12),
      );

      if (needUpdate) {
        const updateAssetDto: UpdateAssetDto = {
          price: apiAsset.current_price,
          payout: apiAsset.payout || null,
          pl: apiAsset.p_l || null,
          pvp: apiAsset.p_vp || null,
          dy: apiAsset.dy || null,
          roe: apiAsset.roe || null,
          net_margin: apiAsset.net_margin || null,
          gross_margin: apiAsset.gross_margin || null,
          gnr: apiAsset.gnr || null,
          gnp: apiAsset.gnp || null,
          vacancy: apiAsset.vacancy || null,
        };

        await this.assetsService.update(asset.id, updateAssetDto);

        return {
          ...asset,
          ...updateAssetDto,
        };
      }

      return asset;
    }

    const createAssetDto: CreateAssetDto = {
      ticker: apiAsset.ticker_name,
      price: apiAsset.current_price,
      payout: apiAsset.payout || null,
      pl: apiAsset.p_l || null,
      pvp: apiAsset.p_vp || null,
      dy: apiAsset.dy || null,
      roe: apiAsset.roe || null,
      net_margin: apiAsset.net_margin || null,
      gross_margin: apiAsset.gross_margin || null,
      gnr: apiAsset.gnr || null,
      gnp: apiAsset.gnp || null,
      vacancy: apiAsset.vacancy || null,
      currency: apiAsset.currency,
      category: category,
    };

    return await this.assetsService.create(createAssetDto);
  }
}
