import { Asset } from "./Asset";
import { Category } from "./Category";

export type CategoryBalance = {
  category: Category;
  id: number;
  percent: number;
  value: number;
};

export type History = {
  date: string;
  month: string;
  currency: string;
  sum_flow: number;
  sum_equity: number;
  sum_applied: number;
  profitability: number;
};

export type WalletPosition = {
  asset: Asset;
  averagePrice: number;
  id: number;
  quantity: number;
  rate: number;
  updatedAt: string;
  yoc: number;
  appreciation: number;
  weightedReturn: number;
  percentWallet: number;
  equityTotal: number;
  equityBrl: string;
};

export type Target = {
  category: Category;
  id: number;
  targetPercentage: number;
};

export type Wallet = {
  id: number;
  name: string;
  applied: number;
  createdAt: string;
  equity: number;
  lastExternalSyncAt: string | null;
  payments_12_months: number;
  payments_total: number;
  profit: number;
  provisioned: number;
  updatedAt: string;
  variation: number;
  variation_payments_12_months: number;
  walletNumber: string;
  categoryBalances: Array<CategoryBalance>;
  history: Array<History>;
  categories: Array<Category & { positions: Array<WalletPosition> }>;
  positions: Array<WalletPosition>;
  targets: Array<Target>;
};
