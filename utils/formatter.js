const { check } = require('optimist');
const { checkKey } = require('./base');
const _ = require('lodash');
const formatter_rules = require('./formatter.json');

// 工具
const upper = str => (str && str.toUpperCase) ? str.toUpperCase() : str;
const makeArrayId = arr => arr.filter(d => d).join('-');

// 资产
const FUTURE_ASSETS = ['THIS_WEEK', 'NEXT_WEEK', 'QUARTER', 'NEXT_QUARTER', 'FUTURE'];
const SWAP_ASSET = 'SWAP';
const SPOT_ASSET = 'SPOT';
const CONTRACT_ASSETS = [SWAP_ASSET, ...FUTURE_ASSETS];

const getAssetType = o => (o && o.asset_type) ? upper(o.asset_type) : null;
const _getExchange = o => (o && o.exchange) ? upper(o.exchange) : null;
const getCoin = o => o.coin ? o.coin : o.pair ? pair2coin(o.pair) : null;
const getPair = o => upper(o.pair);
//
const isFuture = o => FUTURE_ASSETS.includes(getAssetType(o));
const isContract = o => CONTRACT_ASSETS.includes(getAssetType(o));
const isSwap = o => getAssetType(o) === SWAP_ASSET;
const isSpot = o => getAssetType(o) === SPOT_ASSET;
const isReverseContract = o => getPair(o).endsWith('-USD');
const isForwardContract = o => getPair(o).endsWith('-USDT');
const pair2coin = pair => pair ? upper(pair.split('-')[0]) : null;
const isUSDX = o => getPair(o).indexOf('-USD') !== -1;
const isUsdPair = o => getPair(o).endsWith('-USD');
const isUsdtPair = o => getPair(o).endsWith('-USDT');
function getInstrumentId({ exchange = '', asset_type, pair }) {
  return [exchange, asset_type, pair].filter(d => d).join('_').toUpperCase();
}

// ORDER
const ORDER_DONE_STATUS = ['CANCEL', 'SUCCESS', 'FAIL', 'FILLED'];
const isOrderDone = ({ status }) => ORDER_DONE_STATUS.includes(status);
const getOrderVector = ({ side, direction = 'LONG', amount = 1 }) => {
  const sidev = side === 'BUY' ? 1 : side === 'SELL' ? -1 : 0;
  const directionv = direction === 'LONG' ? 1 : direction === 'SHORT' ? -1 : 0;
  return sidev * directionv * amount;
};
// 订单检查
const formatCommonOrder = (order) => {
  if (!order.asset_type) return console.log('order 缺少asset_type...');
  const { pair } = order;
  if (!pair) return console.log('order 缺少pair...');
  if (!order.coin) order.coin = pair2coin(pair);
  if (!order.unique_id) order.unique_id = order.client_oid || order.order_id;
  if (!order.vector)order.vector = getOrderVector(order);
  // if (isContract(order) && !order.lever_rate) return console.log('order(contract) 缺少lever_rate...');
  return order;
};

// BALANCE
const isBalanceValid = (balance) => {
  checkKey(balance, ['unique_id', 'balance', 'api_key']);
};
function getVolumeUsd(o) {
  const { volume, price, ...asset } = o;
  const _volume = volume || 1;
  const exchange = _getExchange(asset);
  const coin = getCoin(asset);
  if (isSpot(asset)) {
    if (isUSDX(asset)) return _volume * price;
    return console.log('getVolumeUsd/isSpot:TODO.....');
  }
  if (exchange === 'BITMEX') {
    if (isSwap(asset)) return _volume * 1;
  } else if (['BINANCE', 'HUOBI', 'OKEX'].includes(exchange)) {
    if (isReverseContract(asset)) {
      if (coin === 'BTC') return 100 * _volume;
      return 10 * _volume;
    } else if (isForwardContract(asset)) {
      return console.log('getVolumeUsd/isForwardContract:TODO.....');
    }
  }
  return console.log(o, 'getVolumeUsd:TODO.....');
}
//
function getBalanceType(asset) {
  const { exchange, balance_type, pair, asset_type } = asset;
  if (balance_type) return balance_type;
  if (asset_type === 'SPOT') return 'SPOT';
  if (exchange === 'BINANCE') {
    if (isContract(asset)) {
      if (isUsdtPair(asset)) return 'USDT_CONTRACT';
      if (isUsdPair(asset)) return 'COIN_CONTRACT';
    }
  }
  if (exchange === 'HUOBI') {
    if (isFuture(asset) && isUsdPair(asset)) return 'FUTURE';
    if (isSwap(asset) && isUsdPair(asset)) return 'COIN_SWAP';
    if (isSwap(asset) && isUsdtPair(asset)) return 'USDT_SWAP';
  }
  console.log('getBalanceType: UNKNOW...');
}
function getBalanceId(asset) {
  const coin = getCoin(asset);
  const exchange = _getExchange(asset);
  const balance_type = getBalanceType(asset);
  if (balance_type === 'SPOT') return makeArrayId([exchange, balance_type, coin]);
  if (exchange === 'BINANCE') {
    if (balance_type === 'COIN_CONTRACT') return makeArrayId([exchange, balance_type, coin]);
    if (balance_type === 'USDT_CONTRACT') return makeArrayId([exchange, balance_type, 'USDT']);
  }
  if (exchange === 'HUOBI') {
    return makeArrayId([exchange, balance_type, asset.pair]);
  }
  return console.log('getBalanceId: TODO....');
}

function isValidOrderId(order_id) {
  return order_id && order_id !== 'false' && order_id !== 'null' && order_id !== 'undefined';
}

const getPositionVector = ({ direction, amount }) => {
  return amount * (direction === 'LONG' ? 1 : direction === 'SHORT' ? -1 : 0);
};

function getContractPositionCoinBalance(p) { // 获取币量
  if (isReverseContract(p)) {
    const usd = getVolumeUsd(p);
    return usd / p.price;
  }
  console.log('getContractPositionCoinBalance: 未知情况...');
}

const genChecker = (o) => {
  const checkName = o.check || o.name;
  if (!checkName) return;
  const checkO = formatter_rules[checkName];
  if (!checkO) return; // console.log(`${o.name}没有checker, 检查${o.check}是否正确...`);
  const { notNull } = checkO;
  const _checker = (d) => {
    checkKey(d, notNull);
  };
  return (res) => {
    console.log(`check: ${o.name}...`);
    if (!res) return;
    if (res && res.error) return;
    if (Array.isArray(res)) return _.map(res, _checker);
    return _checker(res);
  };
};

function mapResult(ds, fn) {
  if (ds && ds.error) return ds;
  return _.map(ds, fn);
}

module.exports = {
  mapResult,
  genChecker,
  isValidOrderId,
  getInstrumentId,
  getCoin,
  getAssetType,
  pair2coin,
  // asset
  FUTURE_ASSETS,
  SWAP_ASSET,
  SPOT_ASSET,
  CONTRACT_ASSETS,
  isContract,
  isFuture,
  isSpot,
  isSwap,
  isUsdPair,
  isUsdtPair,
  // balance等
  isBalanceValid,
  getBalanceId,
  getVolumeUsd,
  // position
  getContractPositionCoinBalance,
  getPositionVector,
  // order
  ORDER_DONE_STATUS,
  isOrderDone,
  getOrderVector,
  formatCommonOrder
}
;
