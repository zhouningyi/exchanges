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
  if (type === 'left') return pair2coin(o.pair);
  if (type === 'right') return pair2coinRight(o.pair);
  return null;
};
const getPair = o => upper(o.pair);
//
const isFuture = o => FUTURE_ASSETS.includes(getAssetType(o));
const isContract = o => CONTRACT_ASSETS.includes(getAssetType(o));
const isSwap = o => getAssetType(o) === SWAP_ASSET;
const isSpot = o => getAssetType(o) === SPOT_ASSET;
const isReverseContract = o => isContract(o) && getPair(o).endsWith('-USD');
const isForwardContract = o => isContract(o) && getPair(o).endsWith('-USDT');
const pair2coin = pair => pair ? upper(pair.split('-')[0]) : null;
const pair2coinRight = pair => pair ? upper(pair.split('-')[1]) : null;
const isUSDX = o => getPair(o).indexOf('-USD') !== -1;
const isUsdPair = o => getPair(o).endsWith('-USD');
const isUsdtPair = o => getPair(o).endsWith('-USDT');
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
  const _volume = isNull(volume) ? 1 : volume;
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
      return _volume * getReverseContractSize(asset);
    } else if (isForwardContract(asset)) {
      return console.log('getVolumeUsd/isForwardContract:TODO.....');
    }
  }
  return console.log(o, 'getVolumeUsd:TODO.....');
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
  if (balance_type === 'SPOT') {
    if (!coin) console.log(asset, 'Asset无法提取coin 字段');
    return makeArrayId([exchange, balance_type, coin]);
  }
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
function checkOrderError(order) {
  const errors = [];
  if (!order.order_id || !order.client_oid) {
    errors.push('order 缺失order_id/client_oid');
  }
  return errors.length ? errors : null;
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
  getBalanceType,
  isBalanceValid,
  getBalanceId,
  getVolumeUsd,
  // position
  createEmptyPosition,
  getReverseContractSize,
  fillPositionsByAssets,
  getContractPositionCoinBalance,
  getPositionVector,
  // order
  ORDER_DONE_STATUS,
  isOrderDone,
  getOrderVector,
  formatCommonOrder
}
;
