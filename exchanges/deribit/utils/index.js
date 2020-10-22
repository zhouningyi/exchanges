const { _parse, checkKey, throwError, cleanObjectNull, SETTLEMENT_QUARTER_MONTHES, getTimeString, getFutureSettlementTime } = require('../../../utils');
const ws = require('./_ws');
const _ = require('lodash');

const { now } = require('lodash');

function pair2coin(pair) {
  return pair.split('-')[0];
}

function pair2symbol(pair) {
  return pair.replace('-', '_').toLowerCase();
}

//
function info2instrument_id({ asset_type, pair, instrument_id }) {
  if (instrument_id) return instrument_id;
  asset_type = asset_type.toUpperCase();
  const coin = pair2coin(pair);
  if (asset_type === 'SWAP') return [coin, 'PERPETUAL'].join('-');
}

function fix(str) {
  if (str.length === 1) return `0${str}`;
  return str;
}

const monthMap = { JAN: '01', FEB: '02', MAR: '03', APR: '04', MAY: '05', JUN: '06', AUG: '08', SEP: '09', OCT: 10, NOV: 11, DEC: 12 };
function period_str2period(period_str) {
  for (const month3 in monthMap) {
    if (period_str.indexOf(month3) !== -1) {
      const [day, year] = period_str.split(month3);
      const month = monthMap[month3];
      return [20 + year, fix(month), fix(day)].join('.');
    }
  }
}


function getDeliveryMap(reverse = false) {
  const contracts = ['quarter', 'next_quarter'];
  const res = {};
  for (const i in contracts) {
    const contract = contracts[i];
    const time = getFutureSettlementTime(new Date(), contract, 'binance');
    const day = getTimeString(time);
    const dstr = day.replace(/-/g, '').substring(2);
    if (reverse) {
      res[dstr] = contract;
    } else {
      res[contract] = dstr;
    }
  }
  return res;
}

const SETTLE_TIME = '16:10:00';

const d1 = 24 * 3600 * 1000;
const d7 = 7 * d1;
const d14 = d7 * 2;
const d90 = d1 * 365 / 4;
// d1 * 90;
function future_id2contract_type(instrument_id) {
  const deliveryMap = getDeliveryMap(false);
  if (!instrument_id) return null;
  const arr = instrument_id.split('-');
  const tsr = arr[arr.length - 1];
  if (deliveryMap[tsr]) {
    return deliveryMap[tsr];
  } else {
    console.log(tsr, 'tsr......');
  }
  const year = tsr.substring(0, 2);
  const month = tsr.substring(2, 4);
  const day = tsr.substring(4, 6);
  const tstr = `20${year}-${month}-${day} 16:10:00`;
  const dt = new Date(tstr) - new Date();
  if (dt > d90 + d14) return 'next_quarter';
  if (dt > d14) return 'quarter';
  if (dt > d7) return 'next_week';
  return 'this_week';
}

function getContractTypeFromString(ext) {
  const period = period_str2period(ext);
  const rmap = getDeliveryMap(true);
  return rmap[period] || 'YEAR';
}

function toUpperCase(v) {
  if (!v) return v;
  if (v && v.toUpperCase) return v.toUpperCase();
  return v;
}
function instrument_id2info(o) {
  const { instrument_name, kind } = o;
  const res = { instrument_id: instrument_name };
  const elems = instrument_name.split('-');
  if (instrument_name.endsWith('PERPETUAL')) {
    const [coin] = instrument_name.split('-');
    const pair = `${coin}-USD`;
    return { ...res, instrument: kind || 'swap', coin, pair, asset_type: 'swap' };
  }
  if (elems.length === 2) {
    const [coin, ext] = instrument_name.split('-');
    const pair = `${coin}-USD`;
    return { ...res, instrument: 'future', coin, pair, asset_type: getContractTypeFromString(ext) };
  }
  if (elems.length > 2 || kind === 'OPTION') {
    let [coin, period, strike, option_type_str] = elems;
    const pair = `${coin}-USD`;
    strike = _parse(strike);
    let option_type = null;
    if (option_type_str === 'P') option_type = 'PUT';
    if (option_type_str === 'C') option_type = 'CALL';

    return { ...res, period_str: period, period: period_str2period(period), instrument: 'option', asset_type: 'option', pair, coin, strike, option_type };
  }
  return res;
}

//
function positionO(o = {}) {
  return { instrument_name: info2instrument_id(o) };
}

function position(d) {
  return _formatPosition(d);
}

function positionsO(o = {}) {
  return {
    currency: pair2coin(o.pair)
  };
}

function _formatPosition(d) {
  const res = {
    ...instrument_id2info(d),
    lever_rate: _parse(d.leverage),
    amount: _parse(d.size),
    profit: _parse(d.total_profit_loss),
    profit_real: _parse(d.realized_profit_loss),
    settlement_price: _parse(d.settlement_price),
    initial_margin: _parse(d.initial_margin),
    mark_price: _parse(d.mark_price),
    price_avg: _parse(d.average_price),
    index_price: _parse(d.index_price),
    maint_margin: _parse(d.maintenance_margin),
    direction: getPositionDirection(d),
    delta: _parse(d.delta)
  };
  if (d.liquidation_price) res.liquidation_price = _parse(d.liquidation_price);
  return res;
}

function positions(ds) {
  return _.map(ds, _formatPosition);
}

function formatOptOrderType(opt, o) {
  const { order_type } = o;
  if (!order_type) return opt;
  if (reverseOrderTypeMap[order_type]) opt.time_in_force = reverseOrderTypeMap[order_type];
  if (order_type === 'POST_ONLY') opt.post_only = true;
  return opt;
}

function getVectorString(o) {
  const { side, direction } = o;
  if (side === 'BUY') return 'buy';
  if (side === 'SELL') return 'sell';
  if (side === 'OPEN') {
    if (direction === 'LONG') return 'buy';
    if (direction === 'SHORT') return 'sell';
  }
  if (side === 'CLOSE') {
    if (direction === 'LONG') return 'sell';
    if (direction === 'SHORT') return 'buy';
  }
}

function assetOrderO(o = {}) {
  const vector_string = getVectorString(o);
  const opt = {
    instrument_name: info2instrument_id(o),
    vector_string,
    amount: o.amount,
    type: o.type.toLowerCase(),
  };
  formatOptOrderType(opt, o);
  if (o.price) opt.price = o.price;
  if (o.client_oid) opt.label = o.client_oid;
  if (o.max_show) opt.max_show = o.max_show;
  // if (o.side === 'CLOSE' || o.side === 'SELL') opt.reduce_only = true;
  console.log(opt, 'opt..');
  return opt;
}

function assetOrder(ds, o) {
  if (!ds) return { ...o, status: 'UNKNOW' };
  return { ...o, ..._formatAssetOrder(ds.order) };
}

function assetOrderInfoO(o = {}) {
  return o;
}
function assetOrderInfo(d) {
  return _formatAssetOrder(d);
}

function coinAssetOrdersO(o = {}) {
  const { coin, instrument } = o;
  const opt = { currency: coin, include_oid: true, include_unfilled: true };
  if (instrument) opt.kind = instrument.toLowerCase();
  return opt;
}
function coinAssetOrders(ds) {
  return ds ? _.map(ds, _formatAssetOrder) : [];
}


function cancelAssetOrder(d) {
  return _formatAssetOrder(d);
}


function _formatFutureDepth(ds) {
  return _.map(ds, (d) => {
    // const action = d[0];
    // if (action === 'delete')console.log(d, '===>>>');
    return {
      // action,
      price: _parse(d[1]),
      amount: _parse(d[2]),
    };
  });
}

function formatTrade(d) {
  return {
    trade_id: d.trade_id,
    amount: d.amount,
    time: new Date(d.timestamp),
    price: d.price,
    mark_price: d.mark_price,
    index_price: d.index_price,
    ...instrument_id2info({ instrument_name: d.instrument_name }),
    side: (d.direction === 'sell') ? 'SHORT' : (d.direction === 'buy') ? 'LONG' : null,
  };
}

function wsTradesO(o = {}) {
  const instrument_id = info2instrument_id(o);
  return { channel: `trades.${instrument_id}.raw` };
}
function wsTrades(ds) {
  return _.map(ds, formatTrade);
}

function wsCoinTradesO(o = {}) {
  return { channel: `trades.${o.instrument}.${o.coin}.raw` };
}
function wsCoinTrades(ds) {
  return _.map(ds, formatTrade);
}

function getPositionDirection(d) {
  const { direction: _direction } = d;
  let direction = null;
  if (_direction === 'buy') direction = 'LONG';
  if (_direction === 'sell') direction = 'SHORT';
  return direction;
}

function _formatAssetPosition(d) {
  return {
    profit: d.total_profit_loss,
    profit_real: d.realized_profit_loss,
    amount: d.size,
    settlement_price: d.settlement_price,
    funding: d.realized_funding,
    open_order_initial_margin: d.open_orders_margin,
    initial_margin: d.initial_margin,
    margin: d.maintenance_margin,
    liquidation_price: d.estimated_liquidation_price,
    price_avg: d.average_price,
    index_price: d.index_price,
    mark_price: d.mark_price,
    lever_rate: d.leverage,
    delta: d.delta,
    direction: getPositionDirection(d),
    ...instrument_id2info(d),
  };
}

function wsAssetPositionO(o) {
  const instrument_id = info2instrument_id(o);
  return { channel: `user.changes.${instrument_id}.raw` };
}

function wsAssetPosition(res, o) {
  const { positions } = res;
  if (positions && positions.length) {
    return _.map(positions, _formatAssetPosition);
  }
  return null;
}


// 订阅数据
function _getTickerChannel(o) {
  const instrument_name = info2instrument_id(o);
  const { interval = '100ms' } = o;
  return `ticker.${instrument_name}.${interval}`;
}

function wsAssetTickerO(o = {}) {
  const { instrument_id, instrument_ids } = o;
  if (instrument_id) return { channel: _getTickerChannel(o) };
  if (instrument_ids) {
    return { channel: _.map(instrument_ids, (instrument_id) => {
      const newo = { ...o, instrument_id };
      return _getTickerChannel(newo);
    }) };
  }
}

function _formatTicker(d) {
  return {
    time: new Date(d.timestamp),
    bid_price: d.best_bid_price,
    ask_price: d.best_ask_price,
    mid_price: (d.best_bid_price + d.best_ask_price) / 2,
    bid_volume: d.best_bid_amount,
    ask_volume: d.best_ask_amount,
    index_price: d.index_price,
    instrument_id: d.instrument_name,
  };
}
function wsAssetTicker(d) {
  return [_formatTicker(d)];
}


// 订阅数据
function _getDepthChannel(o) {
  const instrument_name = info2instrument_id(o);
  const { group = 1, interval = '100ms', depth = 10 } = o;
  return `book.${instrument_name}.${interval}`;
}

function wsAssetDepthO(o = {}) {
  const { instrument_id, instrument_ids } = o;
  if (instrument_id) return { channel: _getDepthChannel(o) };
  if (instrument_ids) {
    return { channel: _.map(instrument_ids, (instrument_id) => {
      const newo = { ...o, instrument_id };
      return _getDepthChannel(newo);
    }) };
  }
}

function wsAssetDepth(ds) {
  const { timestamp, bids, asks, instrument_name } = ds;
  // if (Math.random() < 0.01)console.log(ds, 'ds....');
  return [{
    exchange: 'deribit',
    instrument_id: instrument_name,
    time: new Date(timestamp),
    bids: _formatFutureDepth(bids),
    asks: _formatFutureDepth(asks)
  }];
}

function wsIndexO(o = {}) {
  const symbol = pair2symbol(o.pair);
  return { channel: `deribit_price_index.${symbol}` };
}
function wsIndex(d, o) {
  return {
    pair: o.pair,
    time: new Date(d.timestamp),
    price: d.price,
  };
}

function wsOptionMarkPriceO(o = {}) {
  const symbol = pair2symbol(o.pair);
  return { channel: `markprice.options.${symbol}` };
}


function wsOptionMarkPrice(ds) {
  return _.map(ds, (d) => {
    const { instrument_name, ...rest } = d;
    const info = instrument_id2info({ ...d, kind: 'OPTION' });
    return { ...rest, ...info };
  });
}

const orderTypeMap = {
  good_til_cancelled: 'NORMAL',
  fill_or_kill: 'FOK',
  immediate_or_cancel: 'IOC'
};
const reverseOrderTypeMap = _.invert(orderTypeMap);

function getOrderType(d) {
  const { time_in_force, post_only } = d;
  if (post_only && time_in_force === 'good_til_cancelled') return 'POST_ONLY';
  return orderTypeMap[time_in_force];
}

const orderStateMap = {
  rejected: 'FAIL',
  filled: 'SUCCESS',
  open: 'UNFINISH',
  untriggered: 'UNFINISH',
  cancelled: 'CANCEL',
};

function getOrderDirectionInfo(d) {
  const { direction: _direction, profit_loss, reduce_only } = d;
  const isClose = !!profit_loss || reduce_only;
  const side = isClose ? 'SELL' : 'BUY';
  let direction;
  if (_direction === 'buy') direction = isClose ? 'SHORT' : 'LONG';
  if (_direction === 'sell') direction = isClose ? 'LONG' : 'SHORT';
  return { side, direction };
}

function _formatAssetOrder(d) {
  const order_type = getOrderType(d);
  const res = {
    profit: d.profit_loss,
    reduce_only: d.reduce_only,
    order_id: d.order_id,
    order_type,
    type: toUpperCase(d.order_type),
    is_liquidation: d.is_liquidation,
    price: d.price,
    client_oid: d.label,
    price_avg: d.average_price,
    server_created_at: new Date(d.creation_timestamp),
    server_updated_at: new Date(d.last_update_timestamp),
    time: new Date(d.last_update_timestamp),
    status: orderStateMap[d.order_state],
    max_show: d.max_show,
    ...getOrderDirectionInfo(d),
    ...instrument_id2info(d),
    amount: d.amount,
    filled_amount: d.filled_amount,
    fee: d.commission
  };
  return res;
}


function wsCoinAssetOrderO(o = {}) {
  // const instrument_id = info2instrument_id(o);
  const channel = `user.orders.${o.asset_type}.${o.coin}.raw`;
  // const channel = `user.orders.${instrument_id}.raw`;
  return { channel };
}


function wsCoinAssetOrder(d) {
  return [_formatAssetOrder(d)];
}

function wsAssetAnyChangeO(o = {}) {
  const instrument_id = info2instrument_id(o);
  const channel = `user.changes.${instrument_id}.raw`;
  return { channel };
}

function wsPortfolioO(o = {}) {
  return { channel: `user.portfolio.${o.coin.toLowerCase()}` };
}

function wsPortfolio(d) {
  const { currency: coin, ...rest } = d;
  return { ...rest, coin };
}

function wsAssetAnyChange(ds) {
  console.log(ds, 'ds////');
}

// 市场数据
function assetsO(o = {}) {
  const { coin, instrument, ...rest } = o;
  const res = { currency: coin, expired: false, ...rest };
  if (instrument) res.kind = instrument;
  return res;
}

function assets(ds, o) {
  return _.map(ds, (d) => {
    const pair = `${d.base_currency}-${d.quote_currency}`;
    const res = {
      pair,
      tick_size: d.tick_size,
      taker_fee: d.taker_commission,
      maker_fee: d.maker_commission,
      instrument_id: d.instrument_name,
      contract_size: d.contract_size,
      ...instrument_id2info(d),
    };
    if (d.strike) res.strike = d.strike;
    if (d.settlement_period) res.period = toUpperCase(d.settlement_period);
    if (d.option_type) res.option_type = toUpperCase(d.option_type);
    if (d.min_trade_amount) res.min_trade_amount = d.min_trade_amount;
    if (d.expiration_timestamp) res.expire_time = new Date(d.expiration_timestamp);
    if (d.creation_timestamp) res.create_time = new Date(d.creation_timestamp);
    return res;
  });
}

function volatilityHistoryO(o = {}) {
  return { currency: o.coin };
}
function volatilityHistory(ds) {
  return _.map(ds, d => ({ time: new Date(d[0]), volatility: d[1] }));
}

function getError(res) {
  return res.error;
}

function wsInstrumentDepthO(o = {}) {
  return { channel: `user.portfolio.${o.coin.toLowerCase()}` };
}

function wsInstrumentDepth() {
  // get_book_summary_by_currency
}


function coinBalanceO(o = {}) {
  return { currency: o.coin };
}
function coinBalance(d, o) {
  return { ...d, coin: o.coin };
}


module.exports = {
  coinUnfinishAssetOrdersO: coinAssetOrdersO,
  coinUnfinishAssetOrders: coinAssetOrders,
  coinAssetOrdersO,
  coinAssetOrders,
  assetOrderInfoO,
  assetOrderInfo,
  coinBalanceO,
  coinBalance,
  getError,
  wsInstrumentDepthO,
  wsInstrumentDepth,
  wsAssetPositionO,
  wsAssetPosition,
  wsAssetAnyChangeO,
  wsAssetAnyChange,
  wsCoinAssetOrderO,
  wsCoinAssetOrder,
  wsPortfolioO,
  wsPortfolio,
  // wsAssetTradeO,
  // wsAssetTrade,
  wsOptionMarkPriceO,
  wsOptionMarkPrice,
  wsIndexO,
  wsIndex,
  volatilityHistoryO,
  volatilityHistory,
  wsAssetDepthO,
  wsAssetDepth,
  wsAssetTickerO,
  wsAssetTicker,
  wsTradesO,
  wsTrades,
  wsCoinTradesO,
  wsCoinTrades,
  //
  assetOrderO,
  assetOrder,
  cancelAssetOrder,
  positionO,
  position,
  positionsO,
  positions,
  assetsO,
  assets,
  ws
};
