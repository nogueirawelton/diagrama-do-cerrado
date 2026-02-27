import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { Category } from '../assets/entities/category.entity';
import { WalletPosition } from '../wallets/entities/wallet-position.entity';
import { Wallet } from '../wallets/entities/wallet.entity';
import { WalletsService } from '../wallets/services/wallets.service';
import { CreateContributionDto } from './dto/create-contribution.dto';

interface Position {
  quantity: number;
  rate: number;
  asset: {
    ticker: string;
    currency: string;
    price: number;
  };
}

interface AssetCandidate {
  categoryName: string;
  ticker: string;
  currency: string;
  rate: number;
  nativePrice: number;
  priceInBrl: number;
  currentGap: number;
  purchasedQuantity: number;
  isFractional: boolean;
  minAmount: number;
}

@Injectable()
export class ContributionService {
  constructor(private walletsService: WalletsService) {}

  private async getDollarRate() {
    const { data } = await axios.get(
      'https://economia.awesomeapi.com.br/last/USD-BRL',
    );

    return parseFloat(data.USDBRL.bid);
  }

  private getPriceInBrl(price: number, currency: string, usdRate: number) {
    return currency === 'US$' ? price * usdRate : price;
  }

  private runDiagram(
    contribution: CreateContributionDto,
    wallet: Wallet,
    usdToBrlRate: number,
  ) {
    const maxAmountPerAsset =
      contribution.totalAmount *
      (contribution.maxAmountPercentagePerAsset / 100);

    const targetMap = new Map(
      wallet.targets.map((t) => [t.category.id, t.targetPercentage]),
    );

    const categories = wallet?.positions.reduce(
      (acc, position) => {
        const categoryId = position.asset.category.id;
        const existingCategory = acc.find((item) => item.id === categoryId);

        if (!existingCategory) {
          acc.push({
            ...position.asset.category,
            positions: [position],
            targetPercentage: targetMap.get(categoryId) || 0,
          });
        } else {
          existingCategory.positions.push(position);
        }
        return acc;
      },
      [] as Array<
        Category & { positions: WalletPosition[]; targetPercentage: number }
      >,
    );

    // 1. Calcular Equity Atual Total
    const currentTotalEquityBrl = categories.reduce(
      (acc, cat) =>
        acc +
        cat.positions.reduce(
          (pAcc, pos) =>
            pAcc +
            pos.quantity *
              this.getPriceInBrl(
                pos.asset.price,
                pos.asset.currency,
                usdToBrlRate,
              ),
          0,
        ),
      0,
    );

    const finalEquityGoal = currentTotalEquityBrl + contribution.totalAmount;
    const candidates: AssetCandidate[] = [];

    // 2. Mapear Gaps de Categorias e Ativos
    for (const cat of categories) {
      const categoryCurrentBrl = cat.positions.reduce(
        (acc, pos) =>
          acc +
          pos.quantity *
            this.getPriceInBrl(
              pos.asset.price,
              pos.asset.currency,
              usdToBrlRate,
            ),
        0,
      );

      const categoryTargetBrl = finalEquityGoal * (cat.targetPercentage / 100);
      const categoryGap = categoryTargetBrl - categoryCurrentBrl;

      console.log(
        `Categoria: ${cat.name}, Meta: ${categoryTargetBrl.toFixed(2)} BRL, Atual: ${categoryCurrentBrl.toFixed(2)} BRL, GAP: ${categoryGap.toFixed(2)} BRL`,
      );

      // Só processamos categorias que precisam de aporte
      if (categoryGap > 0) {
        const sumRates = cat.positions.reduce(
          (acc, pos) => acc + (pos.rate || 1),
          0,
        );

        cat.positions.forEach((pos) => {
          const priceInBrl = this.getPriceInBrl(
            pos.asset.price,
            pos.asset.currency,
            usdToBrlRate,
          );
          const assetWeight = (pos.rate || 1) / sumRates;

          const optimalAssetAmount = categoryTargetBrl * assetWeight;
          const currentAssetAmount = pos.quantity * priceInBrl;
          const assetGap = optimalAssetAmount - currentAssetAmount;

          if (assetGap > 0) {
            candidates.push({
              categoryName: cat.name,
              ticker: pos.asset.ticker,
              currency: pos.asset.currency,
              rate: pos.rate,
              nativePrice: pos.asset.price,
              priceInBrl,
              currentGap: assetGap,
              purchasedQuantity: 0,
              isFractional: pos.asset.currency === 'US$' || cat.id === 'Crypto',
              minAmount: cat.id === 'Crypto' ? 0.001 : 0.1,
            });
          }
        });
      }
    }

    // 3. Algoritmo de Aporte Iterativo
    let remainingBalance = contribution.totalAmount;
    let iterations = 0;

    while (remainingBalance > 0.01 && iterations < 500) {
      // Ordenar para sempre priorizar o maior GAP (Essência do Cerrado)
      candidates.sort((a, b) => b.currentGap - a.currentGap);

      const best = candidates.find(
        (c) =>
          c.currentGap > 0 &&
          (c.isFractional ? true : remainingBalance >= c.priceInBrl),
      );

      if (!best) break;

      const currentAssetAportTotal = best.purchasedQuantity * best.priceInBrl;
      const remainingAportLimitForThisAsset =
        maxAmountPerAsset - currentAssetAportTotal;

      if (remainingAportLimitForThisAsset <= 0) {
        best.currentGap = -1;
        continue;
      }

      if (best.isFractional) {
        // O gasto agora respeita: GAP, Saldo Restante E Teto por Ativo
        const amountToSpend = Math.min(
          best.currentGap,
          remainingBalance,
          remainingAportLimitForThisAsset, // Aplica o teto
        );

        const qtyToAdd = amountToSpend / best.priceInBrl;

        if (qtyToAdd >= best.minAmount) {
          best.purchasedQuantity += qtyToAdd;
          best.currentGap -= amountToSpend;
          remainingBalance -= amountToSpend;
        } else {
          best.currentGap = -1;
        }
      } else {
        // Para inteiros, calculamos o máximo de cotas que o teto permite
        const qtyNeededForGap = Math.ceil(best.currentGap / best.priceInBrl);
        const qtyAffordableByBalance = Math.floor(
          remainingBalance / best.priceInBrl,
        );
        const qtyAllowedByLimit = Math.floor(
          remainingAportLimitForThisAsset / best.priceInBrl,
        );

        const qtyToBuy = Math.min(
          qtyNeededForGap,
          qtyAffordableByBalance,
          qtyAllowedByLimit,
        );

        if (qtyToBuy >= 1) {
          const cost = qtyToBuy * best.priceInBrl;
          best.purchasedQuantity += qtyToBuy;
          best.currentGap -= cost;
          remainingBalance -= cost;
        } else {
          best.currentGap = -1;
        }
      }
      iterations++;
    }

    const items = candidates
      .filter((c) => c.purchasedQuantity > 0)
      .map((c) => ({
        category: c.categoryName,
        ticker: c.ticker,
        amount: Number(c.purchasedQuantity.toFixed(c.isFractional ? 8 : 0)),
        priceInBrl: Number(c.priceInBrl.toFixed(2)),
        totalBrlCost: Number((c.purchasedQuantity * c.priceInBrl).toFixed(2)),
      }))
      .sort((a, b) => b.totalBrlCost - a.totalBrlCost);

    const totalAllocated = items.reduce(
      (acc, item) => acc + item.totalBrlCost,
      0,
    );

    return {
      summary: {
        requestedAmount: contribution.totalAmount,
        totalAllocated: Number(totalAllocated.toFixed(2)),
        remainingBalance: Number(remainingBalance.toFixed(2)), // O que sobrou para reserva
      },
      items,
    };
  }

  async create(
    sub: number,
    walletNumber: string,
    createContributionDto: CreateContributionDto,
  ) {
    const wallet = await this.walletsService.findByWalletNumber(
      sub,
      walletNumber,
    );

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const dolarate = await this.getDollarRate();

    return this.runDiagram(createContributionDto, wallet, dolarate);
  }
}
