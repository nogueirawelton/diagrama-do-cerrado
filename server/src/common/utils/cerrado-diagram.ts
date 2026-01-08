import { Wallet } from 'src/modules/wallets/entities/wallet.entity';
import { parseWallet } from './parse-wallet';

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
}

export async function cerradoDiagram(
  contributionAmount: number,
  wallet: Wallet,
  usdToBrlRate: number,
) {
  const parsedWallet = await parseWallet(wallet);

  let totalEquityBrl = 0;

  parsedWallet.categories.forEach((cat) => {
    cat.positions.forEach((pos) => {
      const exchangeRate = pos.asset.currency === 'US$' ? usdToBrlRate : 1;
      totalEquityBrl += pos.quantity * pos.asset.price * exchangeRate;
    });
  });

  const finalEquity = totalEquityBrl + contributionAmount;
  const candidates: AssetCandidate[] = [];

  parsedWallet.categories.forEach((category) => {
    const categoryCurrentAmountBrl = category.positions.reduce((acc, pos) => {
      const exchangeRate = pos.asset.currency === 'US$' ? usdToBrlRate : 1;
      return acc + pos.quantity * pos.asset.price * exchangeRate;
    }, 0);

    const categoryTargetAmount =
      finalEquity * (category.targetPercentage / 100);
    const categoryGap = categoryTargetAmount - categoryCurrentAmountBrl;

    if (categoryGap > 0) {
      const sumRates = category.positions.reduce(
        (acc, pos) => acc + (pos.rate || 1),
        0,
      );

      category.positions.forEach((position) => {
        const isUsd = position.asset.currency === 'US$';
        const exchangeRate = isUsd ? usdToBrlRate : 1;
        const priceInBrl = position.asset.price * exchangeRate;

        const assetRate = position.rate || 1;
        const assetWeight = assetRate / sumRates;

        const optimalAssetAmount = categoryTargetAmount * assetWeight;
        const currentAssetAmount = position.quantity * priceInBrl;

        const assetGap = optimalAssetAmount - currentAssetAmount;

        if (assetGap > 0) {
          candidates.push({
            categoryName: category.category.name,
            ticker: position.asset.ticker,
            currency: position.asset.currency,
            rate: position.rate,
            nativePrice: position.asset.price,
            priceInBrl: priceInBrl,
            currentGap: assetGap,
            purchasedQuantity: 0,

            isFractional: isUsd,
          });
        }
      });
    }
  });

  let remainingBalance = contributionAmount;
  let safetyIterations = 0;

  const MAX_ITERATIONS = 500;

  while (remainingBalance > 0.01 && safetyIterations < MAX_ITERATIONS) {
    candidates.sort((a, b) => b.currentGap - a.currentGap);

    const bestCandidate = candidates.find(
      (c) =>
        c.currentGap > 0 &&
        (c.isFractional
          ? remainingBalance > 0
          : remainingBalance >= c.priceInBrl),
    );

    if (!bestCandidate) break;

    let costBrl = 0;
    let qtyToAdd = 0;

    if (bestCandidate.isFractional) {
      const amountToSpend = Math.min(
        bestCandidate.currentGap,
        remainingBalance,
      );

      const calculatedQty = amountToSpend / bestCandidate.priceInBrl;

      if (calculatedQty < 0.1) {
        bestCandidate.currentGap = -1;
        continue;
      }

      qtyToAdd = calculatedQty;
      costBrl = amountToSpend;
    } else {
      const qtyToFillGap = Math.ceil(
        bestCandidate.currentGap / bestCandidate.priceInBrl,
      );
      const qtyAffordable = Math.floor(
        remainingBalance / bestCandidate.priceInBrl,
      );

      const qtyToBuy = Math.min(qtyToFillGap, qtyAffordable);

      if (qtyToBuy < 1) {
        bestCandidate.currentGap = -1;
        continue;
      }

      qtyToAdd = qtyToBuy;
      costBrl = qtyToAdd * bestCandidate.priceInBrl;
    }

    if (qtyToAdd > 0) {
      remainingBalance -= costBrl;
      bestCandidate.currentGap -= costBrl;
      bestCandidate.purchasedQuantity += qtyToAdd;

      if (bestCandidate.isFractional && remainingBalance > 0.01) {
        bestCandidate.currentGap = 0;
      }
    }

    safetyIterations++;
  }

  return candidates
    .filter((c) => c.purchasedQuantity > 0)
    .map((c) => ({
      category: c.categoryName,
      asset: c.ticker,
      currency: c.currency,
      rate: c.rate,
      price: c.nativePrice,
      amount: c.purchasedQuantity,
      totalNativePrice: c.purchasedQuantity * c.nativePrice,
      totalBrlCost: c.purchasedQuantity * c.priceInBrl,
    }))
    .sort((a, b) => b.totalBrlCost - a.totalBrlCost);
}
