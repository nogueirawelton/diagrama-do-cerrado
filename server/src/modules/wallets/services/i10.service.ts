import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class I10Service {
  constructor() {}

  async getInfo(walletNumber: string) {
    const { data } = await axios.get(
      `https://investidor10.com.br/wallet/api/proxy/wallet-app/summary/info/${walletNumber}`,
    );

    return data;
  }

  async getMetrics(walletNumber: string) {
    const { data } = await axios.get(
      `https://investidor10.com.br/wallet/api/proxy/wallet-app/summary/metrics/${walletNumber}?raw=1`,
    );

    return data;
  }

  async getBalance(walletNumber: string) {
    const { data } = await axios.get(
      `https://investidor10.com.br/wallet/api/proxy/wallet-app/summary/donutchart/${walletNumber}/all?groupBy=ticker`,
    );

    return data;
  }

  async getHistory(walletNumber: string) {
    const { data } = await axios.get(
      `https://investidor10.com.br/wallet/api/proxy/wallet-app/summary/barchart/${walletNumber}/12/all`,
    );

    return data;
  }

  async getPosition(walletNumber: string, category: string) {
    const { data } = await axios.get(
      `https://investidor10.com.br/wallet/api/proxy/wallet-app/summary/actives/${walletNumber}/${category}`,
    );

    return data;
  }
}
