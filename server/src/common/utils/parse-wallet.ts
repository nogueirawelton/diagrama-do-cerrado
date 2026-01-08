import { Wallet } from 'src/modules/wallets/entities/wallet.entity';
import { getDollarRate } from './get-dollar-rate';

export async function parseWallet(wallet: Wallet) {
  const rate = await getDollarRate();

  const walletTotalEquity = wallet.positions.reduce(
    (acc, position) =>
      acc +
      position.quantity *
        position.asset.price *
        (position.asset.currency == 'US$' ? rate : 1),
    0,
  );

  const categories = wallet.targets.map((target) => {
    const positionsByCategories = wallet.positions.filter(
      (position) => position.asset.category.id === target.category.id,
    );

    const categoryTotalEquity = positionsByCategories.reduce(
      (acc, position) =>
        acc +
        position.quantity *
          position.asset.price *
          (position.asset.currency == 'US$' ? rate : 1),
      0,
    );

    const currentPercentage =
      walletTotalEquity > 0
        ? (categoryTotalEquity / walletTotalEquity) * 100
        : 0;

    return {
      ...target,
      currentPercentage: Number(currentPercentage.toFixed(2)),
      totalEquity: categoryTotalEquity,
      positions: positionsByCategories,
    };
  });

  return {
    id: wallet.id,
    name: wallet.name,
    walletNumber: wallet.walletNumber,
    lastExternalSyncAt: wallet.lastExternalSyncAt,
    totalEquity: Number(walletTotalEquity.toFixed(2)),
    categories,
  };
}
