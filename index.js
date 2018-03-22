
const Okex = require('./exchanges/okex');
const Binance = require('./exchanges/binance');
const Kucoin = require('./exchanges/kucoin');

module.exports = {
  Binance,
  Kucoin,
  Okex,
  binance: Binance,
  kucoin: Kucoin,
  okex: Okex,
};
