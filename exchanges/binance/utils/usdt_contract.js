const publicUtils = require('./public');
const ef = require('./../../../utils/formatter');
const _ = require('lodash');
const { cleanObjectNull, getFutureSettlementTime2, getTimeString, isNull } = require('./../../../utils');

const { getOrderTypeOptions, formatInterval, getPrecision, formatSymbolPair, parse: _parse, getOrderDirectionOptions, pair2symbol, parseOrderStatusOptions, parseOrderDirectionOptions, getSymbolId } = publicUtils;

const exchange = 'BINANCE';
const balance_type = 'USDT_CONTRACT';
const asset_type = 'SWAP';
function empty() {
  return {};
}

function getDeliveryMap(reverse = false) {
  const contracts = ['MONTH-0', 'MONTH-1'];
  const res = {};
  const now = new Date();
  for (const i in contracts) {
    const contract = contracts[i];
    const time = getFutureSettlementTime2(now, contract);
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

getFutureSettlementTime2(new Date(), 'MONTH');

function ext2asset_type(ext) {
  const deliveryMap = getDeliveryMap();
  return deliveryMap[ext];
}

function asset_type2ext(asset_type) {
  const reverseDeliveryMap = getDeliveryMap(true);
  return reverseDeliveryMap[asset_type.toUpperCase()];
}

function parseSymbolId(o) {
  const [symbol, ext] = o.symbol.split('_');
  if (!ext) { // USDT合约
    const pair = formatSymbolPair(o.symbol);
    const coin = pair ? pair.split('-')[0] : null;
    const instrument_id = ef.getInstrumentId({ exchange: 'BINANCE', pair, asset_type });
    return { coin, pair, asset_type, instrument_id };
  } else { // BUSD合约
    const pair = formatSymbolPair(symbol);
    const coin = pair ? pair.split('-')[0] : null;
    const asset_type = ext2asset_type(ext);
    const instrument_id = ef.getInstrumentId({ exchange: 'BINANCE', pair, asset_type });
    return { coin, pair, asset_type, instrument_id };
  }
}


function getUsdtContractInstrumentId(o = {}) {
  return ef.getInstrumentId({ asset_type: 'SWAP', exchange, pair: o.pair });
}

//
function _formatUsdtContractAssets(d, o) {
  const res = { ...parseSymbolId(d) };
  const filtersMap = _.keyBy(d.filters, d => d.filterType);
  if (filtersMap) {
    const { PRICE_FILTER, LOT_SIZE } = filtersMap;
    if (PRICE_FILTER) res.price_precision = getPrecision(PRICE_FILTER.tickSize);
    if (LOT_SIZE) res.amount_precision = getPrecision(LOT_SIZE.stepSize);
  }
  return res;
}
const usdtContractAssets = ds => _.map(ds.symbols, _formatUsdtContractAssets);

function usdtContractKlineO(o = {}) {
  const res = { pair: pair2symbol(o.pair), contractType: 'PERPETUAL', interval: formatInterval(o) };
  if (o.limit) res.limit = o.limit;
  return res;
}

function _formatUsdtContractKline(d, o) {
  const instrument_id = getUsdtContractInstrumentId(o);
  const timestamp = d[0];
  return {
    unique_id: [instrument_id, timestamp].join('_'),
    instrument_id,
    time: new Date(timestamp),
    open: _parse(d[1]),
    high: _parse(d[2]),
    low: _parse(d[3]),
    close: _parse(d[4]),
    volume: _parse(d[5]),
    volume_base: _parse(d[7]),
    count: _parse(d[8]),
    volume_long: _parse(d[9]),
  };
}
const usdtContractKline = ds => _.map(ds, _formatUsdtContractKline);

function _formatUsdtContractBalance(d, o, source) {
  const res = {
    balance_type,
    exchange,
    coin: d.asset,
  };
  res.balance_id = ef.getBalanceId(res);
  if (!isNull(d.walletBalance)) {
    res.wallet_balance = _parse(d.walletBalance);
  } else if (!isNull(d.crossWalletBalance)) {
    res.wallet_balance = _parse(d.crossWalletBalance);
  } else if (!isNull(d.balance)) {
    res.wallet_balance = _parse(d.balance);
  }
  // if (d.balance || d.crossWalletBalance || d.walletBalance) res.wallet_balance = _parse(d.balance || d.crossWalletBalance || d.walletBalance);
  if (d.marginBalance) res.balance = _parse(d.marginBalance);
  if (d.availableBalance) res.avaliable_balance = res.balance_available = _parse(d.availableBalance);
  if (d.unrealizedProfit || d.crossUnPnl) res.profit_unreal = _parse(d.unrealizedProfit || d.crossUnPnl);
  if (d.maxWithdrawAmount) res.withdraw_available = _parse(d.maxWithdrawAmount);
  if (d.positionInitialMargin) res.position_initial_margin = _parse(d.positionInitialMargin);
  if (d.marginBalance) res.margin = _parse(d.marginBalance);
  if (d.maintMargin) res.maint_margin = _parse(d.maintMargin);
  if (d.initialMargin) res.initial_margin = _parse(d.initialMargin);
  // if (res.coin === 'BNB')console.log(res, d, source, 'profit_unreal...');
  return res;
}
const usdtContractBalances = (ds, o = {}) => _.map(ds ? ds.assets : [], d => _formatUsdtContractBalance(d, o, 'usdtContractBalances'));

function _formatUsdtContractPosition(d) {
  const info = parseSymbolId(d);
  const res = {
    ...info,
    exchange,
    asset_type,
  };
  if (d.liquidationPrice) res.liquidation_price = _parse(d.liquidationPrice);
  if (d.isAutoAddMargin) res.is_auto_add_margin = d.isAutoAddMargin !== 'false';
  if (d.leverage) res.lever_rate = _parse(d.leverage);
  if (d.entryPrice) res.price_avg = _parse(d.entryPrice);
  if (d.markPrice) res.mark_price = _parse(d.markPrice);
  if (d.unrealizedProfit) res.profit_unreal = _parse(d.unrealizedProfit);
  if (d.positionSide) res.position_side = d.positionSide;
  if (d.positionAmt) {
    res.vector = _parse(d.positionAmt) || 0;
    res.amount = Math.abs(res.vector);
    if (d.positionSide === 'SHORT') {
      res.vector *= -1;
    }
  }
  if (!res.pair) {
    return null;
  }
  return res;
}

const usdtContractPositions = (ds, o) => {
  const res = _.map(ds, d => _formatUsdtContractPosition(d, o)).filter(d => d);
  const resGroup = _.groupBy(res, d => d.instrument_id);
  const result = [];
  for (const instrument_id in resGroup) {
    const arr = resGroup[instrument_id];
    if (arr.length === 1) {
      result.push(arr[0]);// positionSide = BOTH
    } else {
      const arrg = _.keyBy(arr, d => d.position_side);
      const long_vector = arrg.LONG ? arrg.LONG.vector : 0;
      const short_vector = -(arrg.SHORT ? arrg.SHORT.vector : 0);
      const both_vector = arrg.BOTH ? arrg.BOTH.vector : 0;
      const vector = long_vector + short_vector + both_vector;
      const _res = { ...arrg.LONG, position_side: 'LONG_SHORT', vector, amount: Math.abs(vector), long_vector, short_vector, exchange, asset_type };
      result.push(_res);
    }
  }
  return result;
};

function _formatUsdtContractOrder(d, o = {}, source) {
  // if (d && ['17585244961', 17585244961].includes(d.orderId)) console.log(d, source, '1dddd....');
  // console.log(d, 'ddd....');
  const { symbol: symbol_id } = d;
  const { assets, ...rest } = o;
  const info = parseSymbolId(d);
  const res = {
    asset_type,
    ...rest,
    exchange,
    ...parseOrderStatusOptions(d),
    ...parseOrderDirectionOptions(d),
    ...info,
  };
  if (d.avgPrice) res.price_avg = _parse(d.avgPrice);
  // console.log(res.price_avg, 'res.price_avg ...');
  if (d.clientOrderId)res.client_oid = `${d.clientOrderId}`;
  if (d.orderId)res.order_id = `${d.orderId}`;
  if (d.qty || d.origQty) res.amount = _parse(d.qty || d.origQty);

  if (symbol_id)res.symbol_id = symbol_id;

  if (d.executedQty)res.filled_amount = _parse(d.executedQty);

  if (d.updateTime || d.time) res.time = new Date(d.updateTime || d.time);
  if (d.maker || d.maker === false)res.maker = d.maker;
  if (d.price) res.price = _parse(d.price);
  if (d.positionSide) res.position_side = d.positionSide;
  if (d.commissionAsset) res.fee_coin = d.commissionAsset;

  if (d.type && !res.type) res.type = d.type;
  if (d.commission) res.fee = _parse(d.commission);
  if (d.updateTime) {
    res.server_updated_at = new Date(d.updateTime);
  }
  if (d.time && !res.server_updated_at) {
    res.server_updated_at = new Date(d.time);
  }

  if (!isNull(d.reduceOnly)) res.reduce_only = d.reduceOnly;
  if (!isNull(d.activatePrice)) res.event_activate_price = _parse(d.activatePrice);
  if (!isNull(d.stopPrice)) res.event_stop_price = _parse(d.stopPrice);
  if (!isNull(d.priceRate)) res.event_price_rate = _parse(d.priceRate);
  if (!isNull(d.workingType))res.order_working_type = d.workingType;
  if (!isNull(d.origType))res.origin_type = d.origType;

  if (['STOP_MARKET', 'TAKE_PROFIT_MARKET'].includes(res.type) && !['UNFINISH', 'CANCEL'].includes(res.status)) console.log(res, 'res....');
  return cleanObjectNull(res);
}

function _formatUsdtContractOrders(ds, o, source) {
  return _.map(ds, d => _formatUsdtContractOrder(d, o, source));
}

function usdtContractOrders(ds, o) {
  return _.map(ds, d => _formatUsdtContractOrder(d, o, 'usdtContractOrders'));
}

function usdtContractOrdersO(o = {}) {
  const res = {
    symbol: pair2symbol(o.pair),
  };
  if (o.fromId) res.fromId = o.fromId;
  if (o.limit) res.limit = o.limit;
  return res;
}


function usdtContractOrderO(o = {}) {
  const opt = {
    symbol: pair2symbol(o.pair),
    newOrderRespType: 'ACK',
    ...getOrderDirectionOptions(o),
    ...getOrderTypeOptions(o),
    quantity: o.amount
  };
  if (o.client_oid) opt.newClientOrderId = o.client_oid;
  if (o.price) opt.price = o.price;
  if (o.reduce_only) opt.reduceOnly = true;
  return opt;
}

const usdtContractOrder = _formatUsdtContractOrder;


const usdtContractCancelOrderO = publicUtils.formatOrderO;
const usdtContractCancelOrder = _formatUsdtContractOrder;

const usdtContractOrderInfoO = publicUtils.formatOrderO;
const usdtContractOrderInfo = _formatUsdtContractOrder;

const usdtContractUnfinishOrdersO = publicUtils.formatOrderO;
const usdtContractUnfinishOrders = (ds, o) => {
  return _formatUsdtContractOrders(ds, o, 'usdtContractUnfinishOrders');
};

function _formatUsdtContractOrderDetail(d) {
  return {
    unique_id: `${exchange}_${d.id}`,
    ...parseSymbolId(d),
    order_id: `${d.orderId}`,
    // side: d.side,
    amount: _parse(d.qty),
    margin_asset: d.marginAsset,
    fee: _parse(d.commission),
    fee_coin: d.commissionAsset,
    time: new Date(d.time),
    position_side: d.positionSide,
    exec_type: d.maker ? 'MAKER' : 'TAKER',
    buyer: d.buyer,
    side: d.buyer ? 'BUY' : 'SELL'
  };
}


function usdtContractOrderDetailsO(o = {}) {
  const res = { symbol: publicUtils.pair2symbol(o.pair) };
  if (o.fromId) res.fromId = o.fromId;
  if (o.limit) res.limit = o.limit;
  return res;
}
function usdtContractOrderDetails(ds, o) {
  return _.map(ds, d => _formatUsdtContractOrderDetail(d, o));
}


const ledgerTypeMap = {
  [ef.ledgerTypes.TRANSFER]: 'TRANSFER',
  [ef.ledgerTypes.FEE]: 'COMMISSION',
  [ef.ledgerTypes.FUNDING_RATE]: 'FUNDING_FEE'
};
const reverseLedgerTypeMap = _.invert(ledgerTypeMap);

function usdtContractLedgersO(o) {
  const { type } = o;
  const opt = {};
  if (type) opt.incomeType = ledgerTypeMap[type];
  return opt;
}
function usdtContractLedgers(ds) {
  return _.map(ds, (d) => {
    return {
      ...parseSymbolId(d),
      type: reverseLedgerTypeMap[d.incomeType],
      balance: _parse(d.income),
      coin: d.asset,
      time: new Date(d.time),
    };
  }).filter(d => d);
}


function usdtContractUpdateLeverateO(o = {}) {
  return {
    symbol: getSymbolId(o),
    leverage: o.lever_rate,
  };
}
function usdtContractUpdateLeverate(res, o) {
  if (res && res.leverage) return { ...o, lever_rate: res.leverage };
  return null;
}


function usdtContractFundingHistoryO(o = {}) {
  return { symbol: pair2symbol(o.pair) };
}
function usdtContractFundingHistory(ds, o = {}) {
  return _.map(ds, (d) => {
    return {
      exchange,
      asset_type,
      pair: o.pair,
      time: new Date(d.fundingTime),
      funding_rate: _parse(d.fundingRate),
      realized_rate: _parse(d.fundingRate),
      fee_asset: 'USDT'
    };
  });
}

function usdtContractCurrentFundingO(o = {}) {
  return { symbol: pair2symbol(o.pair) };
}

function formatCurrentFunding(d, o) {
  if (!d.nextFundingTime) return null;
  const res = {
    exchange,
    asset_type,
    pair: o ? o.pair : formatSymbolPair(d.symbol),
    mark_price: _parse(d.markPrice),
    index_price: _parse(d.indexPrice),
    estimated_rate: _parse(d.lastFundingRate),
    next_funding_time: new Date(_parse(d.nextFundingTime)),
    time: new Date(d.time),
  };
  if (d.interestRate) res.interest_rate = _parse(d.interestRate);
  res.instrument_id = ef.getInstrumentId(res);
  return res;
}
function usdtContractCurrentFunding(d, o) {
  return formatCurrentFunding(d, o);
}

function usdtContractPositionMode(o) {
  let position_side = null;
  if (o.dualSidePosition === false) {
    position_side = 'BOTH';
  } else if (o.dualSidePosition === true) {
    position_side = 'LONG_SHORT';
  }
  return [{ balance_type, position_side }];
}

function usdtContractUpdatePositionModeO(o) {
}

function usdtContractUpdatePositionMode(d) {
  console.log(d, 'usdtContractUpdatePositionMode..');
}

function usdtContractAdl() {
}

module.exports = {
  usdtContractPositionModeO: empty,
  usdtContractUpdatePositionModeO,
  usdtContractUpdatePositionMode,
  usdtContractPositionMode,
  usdtContractCurrentFundingO,
  usdtContractCurrentFunding,
  usdtContractFundingHistoryO,
  usdtContractFundingHistory,
  usdtContractUpdateLeverateO,
  usdtContractUpdateLeverate,
  usdtContractLedgersO,
  usdtContractLedgers,
  usdtContractOrderDetailsO,
  usdtContractOrderDetails,
  usdtContractUnfinishOrdersO,
  usdtContractUnfinishOrders,
  usdtContractOrderInfoO,
  usdtContractOrderInfo,
  usdtContractCancelOrderO,
  formatCurrentFunding,
  usdtContractCancelOrder,
  usdtContractOrderO,
  usdtContractOrder,
  usdtContractKlineO,
  usdtContractKline,
  usdtContractAssetsO: empty,
  usdtContractAssets,
  //
  formatUsdtContractBalance: _formatUsdtContractBalance,
  usdtContractBalancesO: empty,
  usdtContractBalances,
  usdtContractPositionsO: empty,
  usdtContractPositions,
  usdtContractOrdersO,
  usdtContractOrders
};
