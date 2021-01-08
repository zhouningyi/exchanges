const _ = require('lodash');
const md5 = require('md5');

const Utils = require('./../../../utils');
const meta = require('./../../../utils/meta');

const config = require('./../config');

const { checkKey, throwError, cleanObjectNull, getInstrumentId, _parse, SETTLEMENT_QUARTER_MONTHES, getTimeString, getFutureSettlementTime } = Utils;
// const subscribe = Utils.ws.genSubscribe(config.WS_BASE);

const SETTLE_TIME = '16:10:00';

const d1 = 24 * 3600 * 1000;
const d7 = 7 * d1;
const d14 = d7 * 2;
const d90 = d1 * 365 / 4;
// d1 * 90;


function time(o) {
  return {
    time: new Date(o.serverTime),
    timestamp: o.serverTime
  };
}

const intervalMap = {
  '1m': 60,
  '3m': 180,
  '5m': 300,
  '15m': 900,
  '30m': 1800,
  '1h': 3600,
  '2h': 7200,
  '4h': 14400,
  '6h': 21600,
  '12h': 43200,
  '1d': 86400,
  '1w': 604800,
};

// const futureOrderStatus2Code = _.invert(code2FutureOrderStatus);

function pair2coin(pair) {
  return pair.split('-')[0].toUpperCase();
}

function coin2pair(coin, baseCoin = 'USDT') {
  return (`${coin}-${baseCoin}`).toUpperCase();
}


function usdtContractPairsO(o = {}) {
  return {};
}
function usdtContractPairs(ds) {
  return _.map(ds.symbols, (d) => {
    return {
      pair: `${d.baseAsset}-${d.quoteAsset}`,
      ...d
    };
  });
}

function getPrecision(v) {
  v = _parse(v);
  if (v === 0) return 0;
  return Math.log10(1 / v);
}


function getOrderTypeOptions(o) {
  let { order_type } = o;
  const type = (o.type || 'LIMIT').toUpperCase();
  const opt = { type, timeInForce: 'GTC' };
  if (order_type) {
    order_type = order_type.toUpperCase();
    if (['FOK', 'IOC', 'GTX', 'GTC'].includes(order_type)) opt.timeInForce = order_type;
    if (order_type === 'POST_ONLY') opt.timeInForce = 'GTX';
  }
  return opt;
}

function parseOrderTypeOptions(o) {
  const { type, timeInForce } = o;
  const opt = { type };
  if (timeInForce) {
    if (['FOK', 'IOC', 'GTC'].includes(timeInForce)) opt.order_type = timeInForce;
    if (timeInForce === 'GTX') opt.timeInForce = 'POST_ONLY';
  }
  return opt;
}

function pair2symbol(pair) {
  return pair.replace('-', '');
}

function isFutureType(asset_type) {
  return ['THIS_WEEK', 'NEXT_WEEK', 'NEXT_QUARTER', 'QUARTER'].includes(asset_type);
}

function getSymbolId({ asset_type, pair }) {
  asset_type = asset_type.toUpperCase();
  const symbol = pair2symbol(pair);
  if (asset_type === 'SPOT') return symbol;
  if (asset_type === 'SWAP' && pair && pair.endsWith('-USDT')) return symbol;// USDT合约
  if (asset_type === 'SWAP') return `${symbol}_PERP`;
  if (isFutureType(asset_type)) {
    const ext = contract_type2future_id(asset_type);
    return `${symbol}_${ext}`;
  }
  console.log('getSymbolId:没有匹配 symbolId..');
}

const baseCoins = ['USD', 'USDT', 'BTC', 'ETH', 'BNB', 'BUSD', 'EUR', 'KRW', 'BRL', 'ZAR', 'RUB', 'AUD', 'GBP', 'TRY', 'NGN', 'BIDR', 'UAH', 'TUAH', 'IDRT', 'VND', 'USDC', 'USDS', 'PAX', 'DAI', 'TRX', 'XRP'];

function formatSymbolPair(symbol) {
  symbol = symbol.toUpperCase();
  if (symbol === 'BTCBUSD') return 'BTC-BUSD';
  for (const baseCoin of baseCoins) {
    if (symbol.endsWith(baseCoin)) return symbol.replace(baseCoin, `-${baseCoin}`);
  }
  console.log(`formatSymbolPair:${symbol} 无法标准化...`);
}

function parseSymbolId(o) {
  const [symbol, ext] = o.symbol.split('_');
  const pair = formatSymbolPair(symbol);
  const coin = pair ? pair.split('-')[0] : null;
  const asset_type = ext2asset_type(ext);
  const instrument_id = getInstrumentId({ exchange: 'BINANCE', pair, asset_type });
  return { coin, pair, asset_type, instrument_id };
}

function getDeliveryMap(reverse = false) {
  const contracts = ['QUARTER', 'NEXT_QUARTER'];
  const res = {};
  for (const i in contracts) {
    const contract = contracts[i];
    const time = getFutureSettlementTime(new Date(), contract, 'binance');
    const day = getTimeString(time);
    const dstr = day.replace(/-/g, '').substring(2);
    if (reverse) {
      res[contract] = dstr;
    } else {
      res[dstr] = contract;
    }
  }
  return res;
}

function ext2asset_type(ext) {
  if (ext === 'PERP') return 'SWAP';
  if (!ext) return 'SPOT';
  return future_id2contract_type(ext);
}

function asset_type2ext(asset_type) {
  asset_type = asset_type.toUpperCase();
  if (asset_type === 'SWAP') return 'PERP';
  return contract_type2future_id(asset_type);
}

function future_id2contract_type(ext) {
  const deliveryMap = getDeliveryMap();
  return deliveryMap[ext];
}

function contract_type2future_id(asset_type) {
  const reverseDeliveryMap = getDeliveryMap(true);
  return reverseDeliveryMap[asset_type.toUpperCase()];
}

function getOrderDirectionOptions({ side, direction = 'LONG' }) {
  side = side.toUpperCase();
  direction = direction.toUpperCase();
  const d1 = direction === 'SHORT' ? -1 : 1;
  const s1 = side === 'SELL' ? -1 : 1;
  return { side: d1 * s1 > 0 ? 'BUY' : 'SELL' };
}

function parseOrderDirectionOptions({ side, realizedPnl }) {
  realizedPnl = parseFloat(realizedPnl, 10);
  if (!realizedPnl) {
    if (side === 'SELL') return { side: 'BUY', direction: 'SHORT' };
    if (side === 'BUY') return { side: 'BUY', direction: 'LONG' };
  }
  if (side === 'SELL') return { side: 'SELL', direction: 'LONG' };
  if (side === 'BUY') return { side: 'SELL', direction: 'SHORT' };
}
function parseOrderStatusOptions(d) {
  const { status } = d;
  return {
    status: {
      NEW: 'UNFINISH',
      PARTIALLY_FILLED: 'PARTIAL',
      FILLED: 'SUCCESS',
      CANCELED: 'CANCEL',
      EXPIRED: 'CANCEL',
      NEW_INSURANCE: 'LIQUID',
      NEW_ADL: 'LIQUID',
      REJECTED: 'FAIL'
    }[status]
  };
}
function getOrderStatusOptions(d) {
  const { status } = d;
  return {
    status: {
      UNFINISH: 'NEW',
      PARTIAL: 'PARTIALLY_FILLED',
      SUCCESS: 'FILLED',
      CANCEL: ['CANCELED', 'EXPIRED'],
      LIQUID: ['NEW_INSURANCE', 'NEW_ADL']
    }[status]
  };
}


function _formatOrderO(o) {
  const symbol = getSymbolId(o);
  const opt = { symbol };
  if (o.order_id)opt.orderId = o.order_id;
  if (o.client_oid)opt.origClientOrderId = o.client_oid;
  return opt;
}

function formatDepth(ls) {
  return _.map(ls, l => ({ price: _parse(l[0]), volume: _parse(l[1]) }));
}

function formatInterval({ interval = '1m' }) { // 我们的interval的规范就来自币安不用改动
  return interval;
}
module.exports = {
  formatInterval,
  formatDepth,
  formatOrderO: _formatOrderO,
  parseOrderStatusOptions,
  getOrderStatusOptions,
  getOrderDirectionOptions,
  parseOrderDirectionOptions,
  asset_type2ext,
  parseSymbolId,
  getSymbolId,
  getPrecision,
  pair2symbol,
  getOrderTypeOptions,
  parseOrderTypeOptions,
  usdtContractPairsO,
  usdtContractPairs,
  pair2coin,
  coin2pair,
  parse: _parse,
  formatSymbolPair,
  intervalMap,
  timeO: () => ({}),
  time
};
