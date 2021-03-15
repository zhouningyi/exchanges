
const Utils = require('./../utils');


function fix(config, host) {
  for (const name in config) {
    const l = config[name];
    l.name = name;
    if (!l.sign)l.sign = false;
    if (!l.method) l.method = 'GET';
    if (host && !l.host) l.host = host;
  }
  return config;
}

const spotConfig = {
  accountBalance: {
    name_cn: '账户总资产',
    endpoint: 'v2/account/asset-valuation',
    sign: true,
    desc: '账户总资产',
    notNull: ['base_coin', 'account_type'],
  },
  // // // // // // // 公共部分  // // // // // // //
  spotSystemStatus: {
    name_cn: '系统当前状态',
    endpoint: 'v2/summary.json',
    desc: '获取系统当前状态',
    notNull: [],
    host: 'huobigroup'
  },
  spotAssets: {
    name_cn: '所有现货交易对',
    endpoint: 'v1/common/symbols',
    desc: '所有现货交易对',
    notNull: [],
    check: 'assets'
  },
  spotKline: {
    name: 'spotKline',
    name_cn: 'k线图',
    sign: false,
    endpoint: 'market/history/kline',
    notNull: ['pair', 'interval'],
    check: 'kline'
  },
  // // // // // // // 私有部分  // // // // // // //
  spotBalances: {
    name_cn: '现货账户信息',
    sign: true,
    endpointParams: ['spotId'],
    endpoint: 'v1/account/accounts/{spotId}/balance',
    check: 'balance'
  },
  spotOrder: {
    method: 'POST',
    name_cn: '现货交易',
    sign: true,
    notNull: ['pair', 'type', 'side'],
    endpoint: 'v1/order/orders/place',
    check: 'order'
  },
  spotCancelOrderByOrderId: {
    method: 'POST',
    name_cn: '取消订单(order_id)',
    sign: true,
    notNull: ['order_id'],
    endpointParams: ['order_id'],
    endpoint: 'v1/order/orders/{order_id}/submitcancel'
  },
  spotCancelOrderByClientOrderId: {
    method: 'POST',
    name_cn: '取消订单(client_oid)',
    sign: true,
    notNull: ['client_oid'],
    endpoint: 'v1/order/orders/submitCancelClientOrder'
  },
  spotOrderInfoByOrderId: {
    method: 'GET',
    sign: true,
    name_cn: '订单详情(order_id)',
    endpoint: 'v1/order/orders/{order_id}',
    endpointParams: ['order_id'],
    notNull: ['order_id'],
    check: 'order'
  },
  spotOrderInfoByClientOrderId: {
    method: 'GET',
    sign: true,
    name_cn: '订单详情(client_oid)',
    endpoint: 'v1/order/orders/getClientOrder',
    notNull: ['client_oid'],
    check: 'order'
  },
  spotUnfinishOrders: {
    method: 'GET',
    name_cn: '获取所有未完成的订单',
    sign: true,
    notNull: ['pair'],
    endpoint: 'v1/order/openOrders'
  },
  spotOrderDetails: {
    method: 'GET',
    name_cn: '现货交易明细',
    sign: true,
    notNull: ['pair'],
    endpoint: 'v1/order/matchresults'
  },
  // batchCancelSpotOrders: {
  //   method: 'POST',
  //   name: 'batchCancelSpotOrders',
  //   name_cn: '取消所有未完成的订单',
  //   sign: true,
  //   notNull: [],
  //   endpoint: 'v1/order/orders/batchcancel'
  // },
  // spotMoveBalance: {
  //   method: 'POST',
  //   name_cn: '现货资金划转',
  //   endpoint: 'account/v3/transfer',
  //   sign: true,
  //   notNull: ['source', 'target', 'amount', 'coin']
  // },
  spotInterest: {
    method: 'GET',
    name_cn: '杠杆利率',
    endpoint: 'v1/margin/loan-info',
    sign: true
  },
};

const futureConfig = {
  futureAssets: {
    name_cn: '所有资产',
    desc: '通过订单ID获取单个订单信息',
    endpoint: 'api/v1/contract_contract_info',
    sign: true,
    accept: ['pair'],
    host: 'future',
    check: 'asset'
  },
  futureMoveBalance: {
    method: 'POST',
    name_cn: '期货现货划转',
    endpoint: 'v1/futures/transfer',
    sign: true,
    notNull: ['coin', 'source', 'target', 'amount'],
    rateLimit: 1000 / 10,
    check: 'moveBalance'
  },
  futureUpdateLeverate: {
    method: 'POST',
    name_cn: '修改期货杠杆',
    endpoint: 'api/v1/contract_switch_lever_rate',
    sign: true,
    notNull: ['coin', 'lever_rate'],
    host: 'future',
    rateLimit: 3000 / 1,
  },
  futureBalances: {
    method: 'POST',
    name_cn: '账户余额',
    endpoint: 'api/v1/contract_account_info',
    sign: true,
    notNull: [],
    host: 'future',
    check: 'balance'
  },
  futurePositions: {
    method: 'POST',
    name_cn: '持仓信息',
    endpoint: 'api/v1/contract_position_info',
    sign: true,
    notNull: [],
    host: 'future',
  },
  futureOrder: {
    method: 'POST',
    name_cn: '期货下单',
    sign: true,
    endpoint: 'api/v1/contract_order',
    accept: ['client_oid'],
    notNull: ['pair', 'asset_type', 'side', 'type', 'direction', 'lever_rate'],
    host: 'future',
  },
  futureCancelOrder: {
    method: 'POST',
    name_cn: '期货撤单',
    sign: true,
    endpoint: 'api/v1/contract_cancel',
    accept: ['client_oid'],
    notNull: ['pair', 'asset_type'],
    host: 'future',
  },
  futureOrderInfo: {
    method: 'POST',
    name_cn: '期货订单信息',
    desc: '通过订单ID获取单个订单信息',
    endpoint: 'api/v1/contract_order_info',
    sign: true,
    accept: ['order_id', 'client_oid'],
    notNull: ['pair'],
    host: 'future',
  },
  futureUnfinishOrders: {
    method: 'POST',
    name_cn: '所有未完成的期货订单',
    endpoint: 'api/v1/contract_openorders',
    accept: ['pair'],
    sign: true,
    notNull: ['pair'],
    host: 'future',
  },
  futureOrderDetails: {
    method: 'POST',
    name_cn: '期货成交明细',
    endpoint: 'api/v1/contract_matchresults',
    accept: ['pair'],
    sign: true,
    notNull: ['pair'],
    host: 'future',
  },
};

const publicConfig = {
  time: {
    name: 'time',
    name_cn: '时间',
    sign: false,
    endpoint: 'v1/common/timestamp',
    desc: '获取系统时间',
    notNull: [],
  },
  accounts: {
    name: 'accounts',
    name_cn: '账户信息',
    sign: true,
    endpoint: 'v1/account/accounts'
  },
  //
  coins: {
    name: 'coins',
    name_cn: '币种信息',
    sign: false,
    endpoint: 'v1/common/currencys',
    desc: '获取平台所有币种列表',
    notNull: [],
  },

  spotTicks: {
    name: 'spotTicks',
    name_cn: '现货tick',
    sign: false,
    endpoint: 'market/tickers'
  },
  pointBalances: {
    name: 'pointBalances',
    name_cn: '点卡账户信息',
    sign: true,
    endpointParams: ['pointId'],
    endpoint: 'v1/account/accounts/{pointId}/balance'
  },
  spotOrders: {
    method: 'GET',
    name: 'spotOrders',
    name_cn: '获取所有的订单',
    sign: true,
    notNull: ['pair'],
    endpoint: 'v1/order/orders'
  },
  batchCancelOpenSpotOrders: {
    method: 'POST',
    name: 'batchCancelOpenSpotOrders',
    name_cn: '取消所有未完成的订单',
    sign: true,
    notNull: [],
    endpoint: 'v1/order/orders/batchCancelOpenOrders'
  },
  futureIndex: {
    method: 'GET',
    name: 'futureIndex',
    name_cn: '期货指数',
    sign: false,
    endpoint: 'api/v1/contract_index',
    host: 'future',
  },
  futureTotalAmounts: {
    method: 'GET',
    name: 'futureTotalAmounts',
    name_cn: '平台总持仓',
    endpoint: 'api/v1/contract_open_interest',
    notNull: [],
    host: 'future',
  },
  futureRiskInfo: {
    method: 'GET',
    name: 'futureRiskInfo',
    name_cn: '分摊风险金',
    endpoint: 'api/v1/contract_risk_info',
    notNull: [],
    host: 'future',
  },
  futureBalance: {
    method: 'POST',
    name: 'futureBalance',
    name_cn: '账户余额',
    endpoint: 'api/v1/contract_account_info',
    sign: true,
    notNull: [],
    host: 'future',
  },
  futureFee: {
    method: 'POST',
    name: 'futureFee',
    name_cn: '用户费率',
    endpoint: 'api/v1/contract_fee',
    sign: true,
    notNull: ['pair'],
    host: 'future',
  },
  cancelAllFutureOrders: {
    method: 'POST',
    name: 'cancelAllFutureOrders',
    name_cn: '期货批量撤单',
    endpoint: 'api/v1/contract_cancelall',
    sign: true,
    accept: ['pair', 'contract_type', 'contract_code'],
    host: 'future',
    notNull: ['pair']
  },
  batchCancelFutureOrders: {
    method: 'POST',
    name: 'batchCancelFutureOrders',
    name_cn: '期货批量撤单',
    endpoint: 'api/v1/contract_cancel',
    sign: true,
    accept: ['pair', 'contract_type', 'contract_code'],
    host: 'future',
    notNull: ['pair']
  },
  futureOrders: {
    method: 'POST',
    name: 'futureOrders',
    name_cn: '期货下单',
    sign: true,
    endpoint: 'api/v1/contract_hisorders',
    accept: ['client_oid'],
    notNull: ['pair'],
    host: 'future',
  },
};


const coinSwapConfig = {
  coinSwapAssets: {
    name_cn: '所有币本位永续交易对',
    endpoint: 'swap-api/v1/swap_contract_info',
    desc: '所有币本位永续交易对',
    notNull: [],
    // check: 'assets'
  },
  coinSwapBalances: {
    method: 'POST',
    name_cn: '账户余额',
    endpoint: 'swap-api/v1/swap_account_info',
    sign: true,
    notNull: [],
    check: 'balance'
  },
  coinSwapPositions: {
    method: 'POST',
    name_cn: '永续持仓',
    endpoint: 'swap-api/v1/swap_position_info',
    sign: true,
    notNull: []
  },
  coinSwapOrder: {
    method: 'POST',
    name_cn: '永续下单',
    sign: true,
    endpoint: 'swap-api/v1/swap_order',
    accept: ['client_oid'],
    notNull: ['pair', 'side', 'type', 'direction', 'lever_rate'],
    host: 'future',
  },
  coinSwapCancelOrder: {
    method: 'POST',
    name_cn: '永续撤单',
    sign: true,
    endpoint: 'swap-api/v1/swap_cancel',
    accept: ['client_oid'],
    notNull: ['pair'],
    host: 'future',
  },
  coinSwapOrderInfo: {
    method: 'POST',
    name_cn: '永续订单信息',
    desc: '通过订单ID获取单个订单信息',
    endpoint: 'swap-api/v1/swap_order_info',
    sign: true,
    accept: ['order_id', 'client_oid'],
    notNull: ['pair'],
    host: 'future',
  },
  coinSwapUnfinishOrders: {
    method: 'POST',
    name_cn: '所有未完成的永续订单',
    endpoint: 'swap-api/v1/swap_openorders',
    sign: true,
    notNull: ['pair'],
    host: 'future',
  },
  coinSwapOrders: {
    method: 'POST',
    name_cn: '所有永续订单',
    endpoint: 'swap-api/v1/swap_hisorders',
    sign: true,
    notNull: ['pair'],
    host: 'future',
  },
  coinSwapOrderDetails: {
    method: 'POST',
    name_cn: '永续成交明细',
    endpoint: 'swap-api/v1/swap_matchresults',
    accept: ['pair'],
    sign: true,
    notNull: ['pair'],
    host: 'future',
  },
  coinSwapUpdateLeverate: {
    method: 'POST',
    name_cn: '修改期货杠杆',
    endpoint: 'swap-api/v1/swap_switch_lever_rate',
    sign: true,
    notNull: ['pair', 'lever_rate'],
    host: 'future',
    rateLimit: 3000 / 1,
  },
  coinSwapFundingHistory: {
    method: 'GET',
    name_cn: '资金费率历史',
    endpoint: 'swap-api/v1/swap_historical_funding_rate',
    notNull: ['pair'],
  },
  coinSwapCurrentFunding: {
    method: 'GET',
    name_cn: '当前资金费率',
    endpoint: 'swap-api/v1/swap_funding_rate',
    notNull: ['pair'],
  },
  coinSwapLedger: {
    method: 'POST',
    sign: true,
    name_cn: '结算记录',
    endpoint: 'swap-api/v1/swap_financial_record',
    notNull: ['pair'],
  },
  coinSwapMoveBalance: {
    method: 'POST',
    name_cn: '期货现货划转',
    endpoint: 'v2/account/transfer',
    sign: true,
    notNull: ['coin', 'source', 'target', 'amount'],
    rateLimit: 1000 / 10,
    check: 'moveBalance',
    host: 'spot',
  },
};

const usdtSwapConfig = {
  usdtSwapAssets: {
    name_cn: '所有USDT本位永续交易对',
    endpoint: 'linear-swap-api/v1/swap_contract_info',
    desc: '所有USDT本位永续交易对',
    notNull: [],
  },
  usdtSwapBalances: {
    method: 'POST',
    name_cn: '账户余额',
    endpoint: 'linear-swap-api/v1/swap_cross_account_info',
    sign: true,
    notNull: [],
    // check: 'balance'
  },
  usdtSwapPositions: {
    method: 'POST',
    name_cn: '永续持仓',
    endpoint: 'linear-swap-api/v1/swap_cross_position_info',
    sign: true,
    notNull: []
  },
  usdtSwapOrder: {
    method: 'POST',
    name_cn: '永续下单',
    sign: true,
    endpoint: 'linear-swap-api/v1/swap_cross_order',
    accept: ['client_oid'],
    notNull: ['pair', 'side', 'type', 'direction', 'lever_rate'],
    host: 'future',
  },
  usdtSwapCancelOrder: {
    method: 'POST',
    name_cn: '永续撤单',
    sign: true,
    endpoint: 'linear-swap-api/v1/swap_cross_cancel',
    accept: ['client_oid'],
    notNull: ['pair'],
    host: 'future',
  },
  usdtSwapOrderInfo: {
    method: 'POST',
    name_cn: '永续订单信息',
    desc: '通过订单ID获取单个订单信息',
    endpoint: 'linear-swap-api/v1/swap_cross_order_info',
    sign: true,
    accept: ['order_id', 'client_oid'],
    notNull: ['pair'],
    host: 'future',
  },
  usdtSwapUnfinishOrders: {
    method: 'POST',
    name_cn: '所有未完成的永续订单',
    endpoint: 'linear-swap-api/v1/swap_cross_openorders',
    sign: true,
    notNull: ['pair'],
    host: 'future',
  },
  usdtSwapOrders: {
    method: 'POST',
    name_cn: '所有永续订单',
    endpoint: 'linear-swap-api/v1/swap_cross_hisorders',
    sign: true,
    notNull: ['pair'],
    host: 'future',
  },
  usdtSwapOrderDetails: {
    method: 'POST',
    name_cn: '永续成交明细',
    endpoint: 'linear-swap-api/v1/swap_cross_matchresults',
    accept: ['pair'],
    sign: true,
    notNull: ['pair'],
    host: 'future',
  },
  usdtSwapUpdateLeverate: {
    method: 'POST',
    name_cn: '修改期货杠杆',
    endpoint: 'linear-swap-api/v1/swap_cross_switch_lever_rate',
    sign: true,
    notNull: ['pair', 'lever_rate'],
    host: 'future',
    rateLimit: 3000 / 1,
  },
  usdtSwapFundingHistory: {
    method: 'GET',
    name_cn: '资金费率历史',
    endpoint: 'linear-swap-api/v1/swap_historical_funding_rate',
    notNull: ['pair'],
  },
  usdtSwapCurrentFunding: {
    method: 'GET',
    name_cn: '当前资金费率',
    endpoint: 'linear-swap-api/v1/swap_funding_rate',
    notNull: ['pair'],
  },
  usdtSwapLedger: {
    method: 'POST',
    sign: true,
    name_cn: '结算记录',
    endpoint: 'linear-swap-api/v1/swap_financial_record',
    notNull: ['pair'],
  },
  usdtSwapMoveBalance: {
    method: 'POST',
    name_cn: '期货现货划转',
    endpoint: 'v2/account/transfer',
    sign: true,
    notNull: ['coin', 'source', 'target', 'amount'],
    rateLimit: 1000 / 10,
    check: 'moveBalance',
    host: 'spot',
  },
};

const config = {
  ...fix(spotConfig),
  ...fix(futureConfig),
  ...fix(coinSwapConfig, 'future'),
  ...fix(usdtSwapConfig, 'future'),
  ...fix(publicConfig),
};


module.exports = config;
