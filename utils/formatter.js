const { check } = require('optimist');
const { checkKey, isNull } = require('./base');
const _ = require('lodash');
const formatter_rules = require('./formatter.json');

// 工具
const upper = str => (str && str.toUpperCase) ? str.toUpperCase() : str;
const makeArrayId = arr => arr.filter(d => d).join('-');

// 交易所
const EXCHANGES = [{ id: 'HUOBI', name: '火币' }, { id: 'OKEX', name: 'OK' }, { id: 'BINANCE', name: '币安' }, { id: 'GATE', name: 'GATE' }];
const exchangeMap = _.keyBy(EXCHANGES, d => d.id);
const getExchangeName = exchange => _.get(exchangeMap, `${exchange}.name`);
// 资产
const assetMap = { THIS_WEEK: '当周', NEXT_WEEK: '次周', QUARTER: '季度', NEXT_QUARTER: '次季', FUTURE: '交割合约', SWAP: '永续', SPOT: '现货', MARGIN: '杠杆', OPTION: '期权' };
const FUTURE_ASSETS = ['THIS_WEEK', 'NEXT_WEEK', 'QUARTER', 'NEXT_QUARTER', 'FUTURE'];
const SWAP_ASSET = 'SWAP';
const SPOT_ASSET = 'SPOT';
const CONTRACT_ASSETS = [SWAP_ASSET, ...FUTURE_ASSETS];

const getAssetType = o => (o && o.asset_type) ? upper(o.asset_type) : null;
const _getExchange = o => (o && o.exchange) ? upper(o.exchange) : null;
const getCoin = (o) => {
  const { coin, type = 'left' } = o;
  if (coin) return coin;
  if (type === 'right') return pair2coinRight(o.pair);
  return o.pair ? pair2coin(o.pair) : null;// 有些还有传type='LIMIT'的
};
const getPair = o => upper(o.pair);
//
const coin_contract_bases = ['COIN_CONTRACT', 'COIN_SWAP', 'FUTURE'];
const isSpot = o => getAssetType(o) === SPOT_ASSET || getBalanceType(o) === SPOT_ASSET;
const isFuture = o => FUTURE_ASSETS.includes(getAssetType(o));
const isContract = o => CONTRACT_ASSETS.includes(getAssetType(o)) || (o && ['USDT_CONTRACT', 'COIN_CONTRACT', 'SWAP', 'COIN_SWAP', 'FUTURE'].includes(o.balance_type));
const isSwap = o => getAssetType(o) === SWAP_ASSET;
const isReverseContract = (o) => {
  const balance_type = getBalanceType(o);
  if (balance_type && coin_contract_bases.includes(balance_type)) return true;
  if (isContract(o) && isUsdPair(o)) return true;
  return false;
};
const isForwardContract = o => isContract(o) && getPair(o).endsWith('-USDT');
const pair2coin = pair => pair ? upper(pair.split('-')[0]) : null;
const pair2coinRight = pair => pair ? upper(pair.split('-')[1]) : null;
const isUSDX = o => getPair(o) && getPair(o).indexOf('-USD') !== -1;
const isUsdPair = o => getPair(o) && getPair(o).endsWith('-USD');
const isUsdtPair = o => getPair(o) && getPair(o).endsWith('-USDT');
const getAssetTypeName = asset_type => assetMap[asset_type] || asset_type;
const isLong = ({ direction }) => direction && ['LONG', 'UP'].includes(direction.toUpperCase());
const isShort = ({ direction }) => direction && ['SHORT', 'DOWN'].includes(direction.toUpperCase());

function getInstrumentId({ exchange = '', asset_type, pair }) {
  return [exchange, asset_type, pair].filter(d => d).join('_').toUpperCase();
}
function parseInstrumentId(instrument_id) {
  if (!instrument_id) return null;
  const [exchange, ...rest] = instrument_id.split('_');
  const pair = rest.pop();
  return { exchange, asset_type: rest.join('_'), pair };
}

function instrumentId2name(instrument_id) {
  const info = parseInstrumentId(instrument_id);
  const exchangeName = getExchangeName(info.exchange);
  const assetName = getAssetTypeName(info.asset_type);
  return `${exchangeName}${assetName} ${info.pair}`;
}

// ORDER
const ORDER_DONE_STATUS = ['CANCEL', 'CANCELLING', 'CANCELING', 'SUCCESS', 'FILLED'];// CANCELLING 基本意味着cancel，而且策略有unfinished order的检查
const ORDER_CANCEL_STATUS = ['CANCEL', 'CANCELLING', 'CANCELING'];
const isOrderDone = ({ status }) => ORDER_DONE_STATUS.includes(status);
const isOrderCancel = ({ status }) => ORDER_CANCEL_STATUS.includes(status);
const getOrderVector = ({ side, direction = 'LONG', amount = 1 }) => {
  side = upper(side);
  direction = upper(direction);
  let sidev = 0;
  let directionv = 0;
  if (side === 'BUY') {
    sidev = 1;
  } else if (side === 'SELL') {
    sidev = -1;
  } else if (!['MID', 'mid'].includes(side)) {
    console.log(`getOrderVector/side:${side}...`);
  }
  if (isLong({ direction })) {
    directionv = 1;
  } else if (isShort({ direction })) {
    directionv = -1;
  } else {
    console.log(`getOrderVector/directionv:${direction}...`);
  }
  return sidev * directionv * amount;
};
// 订单检查
const formatCommonOrder = (order) => {
  if (!order.asset_type) return console.log(order, 'order 缺少asset_type...');
  const { pair } = order;
  if (!pair) return console.log('order 缺少pair...');
  if (!order.coin) order.coin = pair2coin(pair);
  if (!order.unique_id) order.unique_id = order.client_oid || order.order_id;
  if (!order.vector) order.vector = getOrderVector(order);
  if (order.order_id) order.order_id = `${order.order_id}`;
  if (order.client_oid) order.client_oid = `${order.client_oid}`;
  // if (isContract(order) && !order.lever_rate) return console.log('order(contract) 缺少lever_rate...');
  return order;
};

// BALANCE
const isBalanceValid = (balance) => {
  checkKey(balance, ['unique_id', 'balance', 'api_key']);
};
function getVolumeUsd(o, source) {
  const { volume, price, ...asset } = o;
  const _volume = isNull(volume) ? 1 : volume;
  const exchange = _getExchange(asset);
  if (isSpot(asset)) {
    if (isUSDX(asset)) return _volume * price;
    return null;// console.log(asset, 'getVolumeUsd/isSpot:TODO.....');
  }
  if (exchange === 'BITMEX') {
    if (isSwap(asset)) return _volume * 1;
  } else if (['BINANCE', 'HUOBI', 'OKEX'].includes(exchange)) {
    if (isReverseContract(asset)) {
      return _volume * getReverseContractSize(asset);
    } else if (isForwardContract(asset)) {
      return _volume * price;
    }
  }
  return console.log(o, source, 'getVolumeUsd:TODO.....');
}


function getBalanceUsd(o) {
  const { volume, spot_price, ...asset } = o;
  if (isSpot(asset)) return volume * spot_price;
  if (isContract(asset)) {
    if (isReverseContract(asset)) return volume * spot_price;
    if (isForwardContract(asset)) return volume;
  }
  console.log('getBalanceUsd/未知的资产....');
}

function getReverseContractSize(asset) {
  const { exchange } = asset;
  if (exchange === 'BITMEX') return 1;
  const coin = getCoin(asset);
  return coin === 'BTC' ? 100 : 10;
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
  if (['HUOBI', 'OKEX'].includes(exchange)) {
    if (isFuture(asset) && isUsdPair(asset)) return 'FUTURE';
    if (isFuture(asset) && isUsdtPair(asset)) return 'USDT_FUTURE';
    if (exchange === 'OKEX') {
      if (isSwap(asset)) return 'SWAP';
    } else if (exchange === 'HUOBI') {
      if (isSwap(asset) && isUsdPair(asset)) return 'COIN_SWAP';
      if (isSwap(asset) && isUsdtPair(asset)) return 'USDT_SWAP';
    }
  }
  console.log(asset, 'getBalanceType: UNKNOW...');
}
function getBalanceId(asset, source) {
  const coin = getCoin(asset);
  if (!coin) console.log(asset, 'ef.getBalanceId: coin lost...');
  const exchange = _getExchange(asset);
  if (!exchange) {
    console.log(asset, 'ef.getBalanceId: exchange lost...');
  }
  const balance_type = getBalanceType(asset);
  if (balance_type === 'SPOT') {
    if (!coin) console.log(asset, 'Asset无法提取coin 字段');
    return makeArrayId([exchange, balance_type, coin]);
  }
  if (exchange === 'BINANCE') {
    if (balance_type === 'COIN_CONTRACT') return makeArrayId([exchange, balance_type, coin]);
    if (balance_type === 'USDT_CONTRACT') {
      if (asset.pair && asset.pair.endsWith('USDT')) return makeArrayId([exchange, balance_type, 'USDT']);
      if (['BUSD', 'BNB'].includes(coin)) return makeArrayId([exchange, balance_type, coin]);
      return makeArrayId([exchange, balance_type, 'USDT']);
    }
  }
  if (['HUOBI', 'OKEX'].includes(exchange)) {
    if (exchange === 'HUOBI' && asset.asset_type === 'SWAP' && asset.pair && asset.pair.endsWith('USDT')) {
      return makeArrayId([exchange, balance_type, 'USDT']);
    }
    if (asset.pair) return makeArrayId([exchange, balance_type, asset.pair]);
    return makeArrayId([exchange, balance_type, 'USDT']);
  }
  return console.log(asset, 'getBalanceId: TODO....');
}

function isValidOrderId(order_id) {
  return order_id && order_id !== 'false' && order_id !== 'null' && order_id !== 'undefined';
}

function reverseOrderO(o) {
  const opt = { ...o };
  if (o.side === 'BUY') opt.side = 'SELL';
  if (o.side === 'SELL') opt.side = 'BUY';
  if (isLong(o)) opt.direction = 'SHORT';
  if (isShort(o)) opt.direction = 'LONG';
  return opt;
}
function checkOrderError(order) {
  const errors = [];
  if (!order.order_id || !order.client_oid) {
    errors.push('order 缺失order_id/client_oid');
  }
  return errors.length ? errors : null;
}
function getAssetInstanceId(asset) {
  const instrument_id = asset.instrument_id || getInstrumentId(asset);
  const { api_key } = asset;
  if (!api_key) return console.log('getAssetInstanceId/没有api_key...');
  return [instrument_id, api_key].join('_');
}

function createEmptyPosition(asset) {
  const res = {
    ...asset,
    coin: pair2coin(asset.pair),
    contract_type: asset.asset_type,
    instrument_id: getInstrumentId(asset),
    long_amount: 0,
    long_benifit: 0,
    long_locked: 0,
    long_margin: 0,
    long_open_price: null,
    vector: 0,
    short_amount: 0,
    short_benifit: 0,
    short_locked: 0,
    short_margin: 0,
    short_open_price: null,
    margin: 0,
    amount: 0,
  };
  return res;
}

function fillPositionsByAssets(ds, assets) {
  return _.values({
    ..._.keyBy(_.map(assets, createEmptyPosition), 'instrument_id'),
    ..._.keyBy(ds, 'instrument_id'),
  });
}

const getPositionVector = ({ direction, amount }) => {
  return amount * (direction === 'LONG' ? 1 : direction === 'SHORT' ? -1 : 0);
};

function getContractPositionCoinBalance(p) { // 获取币量
  if (isReverseContract(p)) {
    const usd = getVolumeUsd(p, 'getContractPositionCoinBalance');
    return usd / p.price;
  } else if (isForwardContract(p)) {
    return p.volume;
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
    // console.log(`check: ${o.name}...`);
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

function wrapperInstrumentId(res) {
  res.instrument_id = getInstrumentId(res);
  return res;
}

const ledgerTypes = {
  FEE: 'FEE',
  TRANSFER: 'TRANSFER',
  FUNDING_RATE: 'FUNDING_RATE',
  REALIZED_PNL: 'REALIZED_PNL'
};

module.exports = {
  ledgerTypes,
  isLong,
  isShort,
  isReverseContract,
  isForwardContract,
  parseInstrumentId,
  instrumentId2name,
  mapResult,
  genChecker,
  checkOrderError,
  isValidOrderId,
  wrapperInstrumentId,
  getInstrumentId,
  getCoin,
  getAssetType,
  pair2coin,
  getExchange: _getExchange,
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
  getAssetInstanceId,
  getBalanceType,
  isBalanceValid,
  getBalanceId,
  getBalanceUsd,
  getVolumeUsd,
  // position
  createEmptyPosition,
  getReverseContractSize,
  fillPositionsByAssets,
  getContractPositionCoinBalance,
  getPositionVector,
  // order
  ORDER_DONE_STATUS,
  reverseOrderO,
  isOrderDone,
  isOrderCancel,
  getOrderVector,
  formatCommonOrder
}
;
