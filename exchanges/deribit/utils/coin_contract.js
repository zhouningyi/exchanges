const _ = require('lodash');
const Utils = require('./../../../utils');
const publicUtils = require('./public');
const md5 = require('md5');
// const moment = require('moment');
const error = require('./../errors');
const { accountTypeMap, intervalMap, reverseOrderTypeMap, orderTypeMap } = require('./public');

const { checkKey, throwError, cleanObjectNull, SETTLEMENT_QUARTER_MONTHES, getTimeString, getFutureSettlementTime } = Utils;


function getDeliveryMap(reverse = false) {
  const contracts = ['quarter', 'next_quarter'];
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

const SETTLE_TIME = '16:10:00';
const { _parse } = Utils;

const d1 = 24 * 3600 * 1000;
const d7 = 7 * d1;
const d14 = d7 * 2;
const d90 = d1 * 365 / 4;
// d1 * 90;


function _formatBalance(d) {
  const res = {
  };
}
function coinContractBalances(ds) {
  return _.map(ds, (d) => {
    return {
      coin: d.asset,
      balance: _parse(d.balance),
      cross_balance: _parse(d.crossWalletBalance),
      profit_unreal: _parse(d.crossUnPnl),
      avaliable_balance: _parse(d.availableBalance),
    };
  });
}


function symbol2Info({ symbol }) {
  const [pair, ext] = symbol.split('_');
  const coin = pair.replace('USD', '');
  const asset_type = ext2asset_type(ext);
  return {
    coin, pair, asset_type
  };
}

function ext2asset_type(ext) {
  if (ext === 'PERP') return 'SWAP';
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

function contract_type2future_id(type) {
  const reverseDeliveryMap = getDeliveryMap(true);
  return reverseDeliveryMap[type.toLowerCase()];
}

function coinContractPositions(ds) {
  const res = _.map(ds.positions, (d) => {
    const info = symbol2Info(d);
    if (info.coin === 'BTC') console.log(d, 1221321);
    return {
      ...info,
      instrument_id: d.symbol,
      lever_rate: _parse(d.leverage),
      position_side: d.positionSide,
      max_amount: _parse(d.maxQty),
      margin: _parse(d.maintMargin),
      avaliable_balance: _parse(d.unrealizedProfit),
      price_avg: _parse(d.entryPrice),
      initial_margin: _parse(d.initialMargin),
      open_order_initial_margin: _parse(d.openOrderInitialMargin),
      position_initial_margin: _parse(d.positionInitialMargin),
      amount: _parse(d.positionAmt) || 0
    };
  });
  // return res;
}

function coinContractPositionsRisk(ds) {
  const res = _.map(ds, (d) => {
    const info = symbol2Info(d);
    return {
      ...info,
      amount: _parse(d.positionAmt),
      price_avg: _parse(d.entryPrice),
      mark_price: _parse(d.markPrice),
      avaliable_balance: _parse(d.unrealizedProfit),
      max_amount: _parse(d.maxQty),
      lever_rate: _parse(d.leverage),
      liquidation_price: _parse(d.liquidationPrice),
      position_side: _parse(d.positionSide),
      margin_mode: d.marginType
    };
  });
  return res;
}


function pair2symbol(pair) {
  return pair.replace('-', '');
}

function coinContractOrdersO(o = {}) {
  const { pair, asset_type } = o;
  const sb = pair2symbol(pair);
  const ext = asset_type2ext(asset_type);
  const symbol = `${sb}_${ext}`;
  const res = { symbol };
  if (o.fromId) res.fromId = o.fromId;
  if (o.limit) res.limit = o.limit;
  return res;
}

function getSideInfo({ side, realizedPnl }) {
  realizedPnl = parseFloat(realizedPnl, 10);
  if (realizedPnl === 0) {
    if (side === 'SELL') return { side: 'OPEN', direction: 'SHORT' };
    if (side === 'BUY') return { side: 'OPEN', direction: 'LONG' };
  }
  if (side === 'SELL') return { side: 'CLOSE', direction: 'LONG' };
  if (side === 'BUY') return { side: 'CLOSE', direction: 'SHORT' };
}

function coinContractOrders(ds) {
  return _.map(ds, (d) => {
    const { symbol: instrument_id } = d;
    const info = symbol2Info(d);
    return {
      instrument_id,
      order_id: d.orderId,
      price: _parse(d.price),
      amount: _parse(d.qty),
      fee: _parse(d.commission),
      fee_coin: d.commissionAsset,
      position_side: d.positionSide,
      maker: d.maker,
      time: new Date(d.time),
      ...getSideInfo(d),
      ...info,
    };
  });
}

const direct = d => d;

module.exports = {
  coinContractOrdersO,
  coinContractOrders,
  coinContractPositionsRisk,
  coinContractPositions,
  coinContractBalances,
};
