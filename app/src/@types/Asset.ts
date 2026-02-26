import { Category } from "./Category";

export type Asset = {
  currency: string;
  dy: number;
  gnp: number | null;
  gnr: number | null;
  gross_margin: number | null;
  net_margin: number | null;
  payout: number | null;
  pl: number | null;
  price: number;
  pvp: number;
  roe: number | null;
  ticker: string;
  updatedAt: string;
  vacancy: number | null;
  category: Category;
  url: string;
};
