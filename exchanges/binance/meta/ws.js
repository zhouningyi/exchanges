
const _ = require('lodash');
const Utils = require('./../utils');

const { getSymbolId } = require('./../utils/public');
const { SPOT_WS_BASE, COIN_CONTRACT_WS_BASE, USDT_CONTRACT_WS_BASE } = require('./../config');
const coinContractUtils = require('./../utils/coin_contract');
const spotUtils = require('./../utils/spot');
const publicUtils = require('./../utils/public');
const { _parse } = require('../../../utils');
const ef = require('./../../../utils/formatter');

const exchange = 'BINANCE';

function wsSpotDepthStream(o) {
  const { assets: _assets, pair, asset_type = 'SPOT', level = 5 } = o;
  const assets = _assets || [{ pair, asset_type, level }];
  return _.map(assets, ({ pair, asset_type = 'SPOT', level = 5 }) => {
    const symbolId = getSymbolId({ pair, asset_type });
    return `${symbolId}@depth${level}@100ms`.toLowerCase();
  });
}

function wsSpotDepthFormater(d, o) {
  const symbol = d.stream.split('@depth')[0];
  const { bids, asks } = d.data;
  const res = {
    time: new Date(),
    exchange,
    symbol_id: symbol,
    ...getWsOptions(d),
    ...publicUtils.parseSymbolId({ symbol }),
    bids: spotUtils.formatSpotContractDepth(bids),
    asks: spotUtils.formatSpotContractDepth(asks)
  };
  return res;
}

function wsSpotTickStream(o) {
  const { assets: _assets, pair, asset_type, level = 5 } = o;
  const assets = _assets || [{ pair, asset_type, level }];
  return _.map(assets, ({ pair, asset_type, level = 5 }) => {
    const symbolId = getSymbolId({ pair, asset_type });
    return `${symbolId}@ticker`.toLowerCase();
  });
}

function wsSpotTickFormater(d, o) {
  const { s: symbol, b: bid_price, a: ask_price, A: ask_volume, B: bid_volume } = d;
  return {
    symbol_id: symbol,
    ...getWsOptions(d),
    exchange,
    ...publicUtils.parseSymbolId({ exchange, symbol }),
    bid_volume: _parse(bid_volume),
    bid_price: _parse(bid_price),
    ask_price: _parse(ask_price),
    ask_volume: _parse(ask_volume),
  };
}

function wsSpotBalancesFormater(res, o) {
  const { e: eventName, ...rest } = res.data;
  if (eventName === 'outboundAccountPosition') {
    const server_updated_at = new Date(rest.E);
    return _.map(rest.B, (_l) => {
      const avaliable_balance = _parse(_l.f);
      const locked_balance = _parse(_l.l);
      const l = {
        exchange,
        asset_type: 'SPOT',
        server_updated_at,
        coin: _l.a,
        balance: avaliable_balance + locked_balance,
        avaliable_balance,
        locked_balance
      };
      l.balance_id = ef.getBalanceId(l);
      return l;
    });
  } else if (eventName === 'outboundAccountInfo') { // 这个后面要废弃
  } else if (eventName === 'balanceUpdate') { // 增量 暂时不放进来
    // const l = {
    //   asset_type: 'SPOT',
    //   coin: rest.a,
    //   server_updated_at: new Date(rest.E),
    //   balance: _parse(rest.d)
    // };
    // l.balance_id = ef.getBalanceId(l);
    // return [l];
  } else {
    console.log('wsSpotBalancesFormater/unknown eventName...');
  }
}

function wsSpotOrderFormater(res, o) {
  const d = res.data;
  const {
    s: symbol,
    C: clientOrderId,
    S: side,
    o: type,
    q: qty,
    p: price,
    X: status,
    z: executedQty,
    i: orderId,
    n: commission,
    N: commissionAsset,
    T: time,
    m: maker,
  } = d;
  const orginOrder = {
    type,
    status,
    time,
    symbol,
    orderId: `${orderId}`,
    clientOrderId,
    price,
    qty,
    executedQty,
    commission,
    commissionAsset,
    maker,
    side,
  };
  return spotUtils.formatSpotOrder(orginOrder, o);
}

const spotConfig = {
  wsSpotDepth: {
    name: '现货深度',
    streamName: wsSpotDepthStream,
    chanel: d => d && d.stream && d.stream.indexOf('@depth') !== -1,
    formater: wsSpotDepthFormater,
  },
  wsSpotTicks: {
    name: '现货tick',
    streamName: wsSpotTickStream,
    chanel: '24hrTicker',
    formater: wsSpotTickFormater,
  },
  wsSpotBalances: {
    name: '币本位合约资产',
    streamName: 'listenKey',
    chanel: d => d && d.data && d.data.e && ['outboundAccountPosition', 'outboundAccountInfo', 'balanceUpdate'].includes(d.data.e),
    formater: wsSpotBalancesFormater,
    sign: true,
  },
  wsSpotOrders: {
    name: '现货订单',
    streamName: 'listenKey',
    chanel: d => d && d.data && d.data.e === 'executionReport',
    formater: wsSpotOrderFormater,
    sign: true
  },
};

const usdtContractConfig = {
  wsUsdtContractDepth: {
    name: 'USDT合约深度',
    streamName: wsCoinContractDepthStream,
    chanel: 'depthUpdate',
    formater: wsUsdtContractDepthFormater,
  },
  wsUsdtContractOrders: {
    name: '币本位合约订单',
    streamName: 'listenKey',
    chanel: 'ORDER_TRADE_UPDATE',
    formater: d => wsCoinContractOrderFormater(d, { asset_type: 'SWAP' }),
    sign: true
  },
  wsUsdtContractPositions: {
    name: 'USDT合约仓位',
    streamName: 'listenKey',
    chanel: 'ACCOUNT_UPDATE',
    formater: wsCoinContractPositionsFormater,
    sign: true
  },
  wsUsdtContractBalances: {
    name: 'USDT合约资产',
    streamName: 'listenKey',
    chanel: 'ACCOUNT_UPDATE',
    formater: wsCoinContractBalancesFormater,
    sign: true,
  },
};

function wsCoinContractDepthStream(o) {
  const { assets: _assets, pair, asset_type, level = 5 } = o;
  const assets = _assets || [{ pair, asset_type, level }];
  const res = _.map(assets, ({ pair, asset_type, level = 5 }) => {
    const symbolId = getSymbolId({ pair, asset_type });
    return `${symbolId}@depth${level}@100ms`.toLowerCase();
  });
  return res;
}

function getWsOptions(o) {
  const opt = {};
  if (o.E)opt.event_time = new Date(o.E);
  if (o.T)opt.time = new Date(o.T);
  return opt;
}

function wsUsdtContractDepthFormater(d, o) {
  const { s: symbol, b: bids, a: asks } = d;
  // if (Math.random() < 0.1) console.log(new Date() - new Date(d.T));
  return {
    symbol_id: symbol,
    ...getWsOptions(d),
    exchange,
    ...publicUtils.parseSymbolId({ symbol: `${symbol}_PERP` }),
    bids: coinContractUtils.formatCoinContractDepth(bids),
    asks: coinContractUtils.formatCoinContractDepth(asks)
  };
}

function wsCoinContractDepthFormater(d, o) {
  const { s: symbol, b: bids, a: asks } = d;
  const res = {
    symbol_id: symbol,
    ...getWsOptions(d),
    exchange,
    ...publicUtils.parseSymbolId({ symbol }),
    bids: coinContractUtils.formatCoinContractDepth(bids),
    asks: coinContractUtils.formatCoinContractDepth(asks)
  };
  return res;
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
    rp: realizedPnl,
    ot: type
   } = d;
  const orginOrder = {
    type,
    status,
    time,
    symbol,
    orderId: `${orderId}`,
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
    ..._parseWsCoinContractOrder(order, { ...o }),
  }];
}

function wsCoinContractBalancesFormater(d) {
  const account = d.a;
  if (!account) return null;
  return _.map(account.B, (b) => {
    const { a: asset, wb: walletBalance, cw: crossWalletBalance } = b;
    const originBalance = { asset, walletBalance, crossWalletBalance };
    return { ...coinContractUtils.formatCoinContractBalance(originBalance, {}, 'wsCoinContractBalancesFormater') };
  });
}

function wsRequestCoinContractPositionsFormater(d) {
  const ps = _.get(d, 'result.0.res.positions');
  return ps ? _.map(ps, coinContractUtils.formatCoinContractPosition).filter(d => d) : null;
}

function wsCoinContractPositionsFormater(d) {
  const account = d.a;
  if (!account) return null;
  const res = _.map(account.P, (p) => {
    const { s: symbol, pa: positionAmt, ep: entryPrice, up: unrealizedProfit, ps: positionSide } = p;
    const originPosition = { symbol, positionAmt, asset_type: 'SWAP', entryPrice, unrealizedProfit, positionSide };
    return { ...coinContractUtils.formatCoinContractPosition(originPosition) };
  });
  return res;
}

function wsRequestCoinContractBalancesFormater(d, o) {
  const bs = _.get(d, 'result.0.res.balances');
  return bs ? _.map(bs, b => coinContractUtils.formatCoinContractBalance(b, o, 'wsRequestCoinContractBalancesFormater')).filter(d => d) : null;
}

const coinContractConfig = {
  wsCoinContractDepth: {
    name: '币本位合约深度',
    streamName: wsCoinContractDepthStream,
    chanel: 'depthUpdate',
    formater: wsCoinContractDepthFormater,
  },
  wsCoinContractOrders: {
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
  wsRequestCoinContractPositions: {
    name: '币本位合约仓位',
    streamName: 'listenKey@position',
    chanel: d => d && d.result && d.result[0] && d.result[0].req && d.result[0].req.endsWith('@position'),
    formater: wsRequestCoinContractPositionsFormater,
    sign: true,
    method: 'REQUEST'
  },
  wsCoinContractBalances: {
    name: '币本位合约资产',
    streamName: 'listenKey',
    chanel: 'ACCOUNT_UPDATE',
    formater: wsCoinContractBalancesFormater,
    sign: true,
  },
  wsRequestCoinContractBalances: {
    name: '币本位合约仓位',
    streamName: 'listenKey@balance',
    chanel: d => d && d.result && d.result[0] && d.result[0].req && d.result[0].req.endsWith('@balance'),
    formater: wsRequestCoinContractBalancesFormater,
    sign: true,
    method: 'REQUEST'
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
