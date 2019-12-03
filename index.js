
const Okex = require('./exchanges/okex');

const OkexV3 = require('./exchanges/okex.v3');
const Huobi = require('./exchanges/huobi');
const Binance = require('./exchanges/binance');
const Kucoin = require('./exchanges/kucoin');
const Hitbtc = require('./exchanges/hitbtc');
const Bittrex = require('./exchanges/bittrex');
const Fcoin = require('./exchanges/fcoin');
const Coinall = require('./exchanges/coinall');
const Bitmex = require('./exchanges/bitmex');
const Bikicoin = require('./exchanges/bikicoin');
const Kraken = require('./exchanges/kraken');
// const Liquid = require('./exchanges/liquid');
const Bitflyer = require('./exchanges/bitflyer');

module.exports = {
  Kraken,
  Bitflyer,
  Bikicoin,
  Binance,
  Coinall,
  Kucoin,
  Bitmex,
  Huobi,
  OkexV3,
  Okex,
  Fcoin,
  // binance: Binance,
  // kucoin: Kucoin,
  // okex: Okex,
  Hitbtc,
  // hitbtc: Hitbtc,
  Bittrex,
  // bittrex: Bittrex
};
