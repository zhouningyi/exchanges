
const _ = require('lodash');
const Utils = require('./../utils');
const { getSymbolId } = require('./../utils/public');
const { SPOT_WS_BASE, COIN_CONTRACT_WS_BASE, USDT_CONTRACT_WS_BASE } = require('./../config');
const coinContractUtils = require('./../utils/coin_contract');
const publicUtils = require('./../utils/public');

const spotConfig = {
};

const usdtContractConfig = {
};


function wsCoinContractDepthStream(o) {
  const { assets: _assets, pair, asset_type, level = 5 } = o;
  const assets = _assets || [{ pair, asset_type, level }];
  return _.map(assets, ({ pair, asset_type, level = 5 }) => {
    const symbolId = getSymbolId({ pair, asset_type });
    return `${symbolId}@depth${level}`.toLowerCase();
  });
}

function getWsOptions(o) {
  const opt = {};
  if (o.E)opt.event_time = new Date(o.E);
  if (o.T)opt.time = new Date(o.T);
  return opt;
}
function wsCoinContractDepthFormater(d, o) {
  const { s: symbol, b: bids, a: asks } = d;
  return {
    symbol_id: symbol,
    ...getWsOptions(d),
    ...publicUtils.parseSymbolId({ symbol }),
    bids: coinContractUtils.formatCoinContractDepth(bids),
    asks: coinContractUtils.formatCoinContractDepth(asks)
  };
}

function _parseWsOrder(d, o) {
  const {
    c: clientOrderId,
    p: price,
    ap: price_avg,
    S: side,
    X: status,
    q: qty,
    z: executedQty,
    i: orderId,
    n: commission,
    N: commissionAsset,
    s: symbol,
    ps: positionSide,
    m: maker,
    T: time,
    rp: realizedPnl
   } = d;
  const orginOrder = {
    status,
    time,
    symbol,
    orderId,
    clientOrderId,
    price,
    price_avg,
    qty,
    executedQty,
    commission,
    commissionAsset,
    positionSide,
    maker,
    side,
    realizedPnl,
  };
  return coinContractUtils.formatCoinContractOrder(orginOrder, o);
}

function _parseWsCoinContractOrder(d, o) {
  return _parseWsOrder(d, o);
}

function wsCoinContractOrderFormater(d, o) {
  const { o: order } = d;
  const { s: symbol } = order;
  return [{
    ...getWsOptions(d),
    ...publicUtils.parseSymbolId({ symbol }),
    ..._parseWsCoinContractOrder(order, o),
  }];
}

function wsCoinContractBalancesFormater(d) {
  const account = d.a;
  if (!account) return null;
  return _.map(account.B, (b) => {
    const { a: asset, wb: walletBalance, cw: crossWalletBalance } = b;
    const originBalance = { asset, walletBalance, crossWalletBalance };
    return { ...coinContractUtils.formatCoinContractBalance(originBalance) };
  });
}

function wsCoinContractPositionsFormater(d) {
  const account = d.a;
  if (!account) return null;
  return _.map(account.P, (p) => {
    const { s: symbol, pa: positionAmt, ep: entryPrice, up: unrealizedProfit, ps: positionSide } = p;
    const originPosition = { symbol, positionAmt, entryPrice, unrealizedProfit, positionSide };
    return { ...coinContractUtils.formatCoinContractPosition(originPosition) };
  });
}
const coinContractConfig = {
  wsCoinContractDepth: {
    name: '币本位合约深度',
    streamName: wsCoinContractDepthStream,
    chanel: 'depthUpdate',
    formater: wsCoinContractDepthFormater,
  },
  wsCoinContractOrder: {
    name: '币本位合约订单',
    streamName: 'listenKey',
    chanel: 'ORDER_TRADE_UPDATE',
    formater: wsCoinContractOrderFormater,
    sign: true
  },
  wsCoinContractPositions: {
    name: '币本位合约仓位',
    streamName: 'listenKey',
    chanel: 'ACCOUNT_UPDATE',
    formater: wsCoinContractPositionsFormater,
    sign: true
  },
  wsCoinContractBalances: {
    name: '币本位合约资产',
    streamName: 'listenKey',
    chanel: 'ACCOUNT_UPDATE',
    formater: wsCoinContractBalancesFormater,
    sign: true
  },
};

function getBase(baseType) {
  if (baseType === 'coinContract') return COIN_CONTRACT_WS_BASE;
  if (baseType === 'usdtContract') return USDT_CONTRACT_WS_BASE;
  if (baseType === 'spot') return SPOT_WS_BASE;
}

function fix(config, baseType) {
  for (const name in config) {
    const l = config[name];
    l.name = name;
    l.baseType = baseType;
    l.base = getBase(baseType);
    if (!l.method) l.method = 'SUBSCRIBE';
  }
  return config;
}

const config = {
  ...fix(spotConfig, 'spot'),
  ...fix(usdtContractConfig, 'usdtContract'),
  ...fix(coinContractConfig, 'coinContract'),
};


module.exports = config;
