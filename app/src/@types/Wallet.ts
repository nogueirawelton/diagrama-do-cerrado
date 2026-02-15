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
};
