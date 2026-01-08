import axios from 'axios';

export async function getDollarRate() {
  const { data } = await axios.get(
    'https://economia.awesomeapi.com.br/last/USD-BRL',
  );

  return parseFloat(data.USDBRL.bid);
}
