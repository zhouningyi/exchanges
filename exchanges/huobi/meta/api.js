
const Utils = require('./../utils');

module.exports = {
  // // // // // // // 公共部分  // // // // // // //
  pairs: {
    name: 'pairs',
    name_cn: '币对信息',
    sign: false,
    endpoint: 'v1/common/symbols',
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
  time: {
    name: 'time',
    name_cn: '时间',
    sign: false,
    endpoint: 'v1/common/timestamp',
    desc: '获取系统时间',
    notNull: [],
  },
  spotKline: {
    name: 'spotKline',
    name_cn: 'k线图',
    sign: false,
    endpoint: 'market/history/kline',
    notNull: ['pair', 'interval']
  },
  spotTicks: {
    name: 'spotTicks',
    name_cn: '现货tick',
    sign: false,
    endpoint: 'market/tickers'
  },
  accounts: {
    name: 'accounts',
    name_cn: '账户信息',
    sign: true,
    endpoint: 'v1/account/accounts'
  },
  spotBalances: {
    name: 'spotBalances',
    name_cn: '现货账户信息',
    sign: true,
    endpointParams: ['spotId'],
    endpoint: 'v1/account/accounts/{spotId}/balance'
  },
  spotBalance: {
    name: 'spotBalance',
    name_cn: '现货账户信息',
    sign: true,
    endpointParams: ['spotId'],
    endpoint: 'v1/account/accounts/{spotId}/balance'
  },
  pointBalances: {
    name: 'pointBalances',
    name_cn: '点卡账户信息',
    sign: true,
    endpointParams: ['pointId'],
    endpoint: 'v1/account/accounts/{pointId}/balance'
  },
  spotOrder: {
    method: 'POST',
    name: 'spotOrder',
    name_cn: '现货交易',
    sign: true,
    notNull: ['pair', 'type', 'side'],
    endpoint: 'v1/order/orders/place'
  },
  spotOrders: {
    method: 'GET',
    name: 'spotOrders',
    name_cn: '获取所有的订单',
    sign: true,
    notNull: ['pair'],
    endpoint: 'v1/order/orders'
  },
  spotOrderInfo: {
    method: 'GET',
    name: 'spotOrderInfo',
    sign: true,
    name_cn: '订单详情',
    endpoint: 'v1/order/orders/{order_id}',
    endpointParams: ['order_id'],
    notNull: ['order_id'],
  },
  unfinishSpotOrders: {
    method: 'GET',
    name: 'unfinishSpotOrders',
    name_cn: '获取所有未完成的订单',
    sign: true,
    notNull: ['pair'],
    endpoint: 'v1/order/openOrders'
  },
  batchCancelSpotOrders: {
    method: 'POST',
    name: 'batchCancelSpotOrders',
    name_cn: '取消所有未完成的订单',
    sign: true,
    notNull: [],
    endpoint: 'v1/order/orders/batchcancel'
  },
  batchCancelOpenSpotOrders: {
    method: 'POST',
    name: 'batchCancelOpenSpotOrders',
    name_cn: '取消所有未完成的订单',
    sign: true,
    notNull: [],
    endpoint: 'v1/order/orders/batchCancelOpenOrders'
  },
  futurePairs: {
    method: 'GET',
    name: 'futurePairs',
    name_cn: '期货币种信息',
    desc: '期货币种信息',
    endpoint: 'api/v1/contract_contract_info',
    host: 'future',
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
  futureBalances: {
    method: 'POST',
    name: 'futureBalances',
    name_cn: '账户余额',
    endpoint: 'api/v1/contract_account_info',
    sign: true,
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
  futurePositions: {
    method: 'POST',
    name: 'futurePositions',
    name_cn: '持仓信息',
    endpoint: 'api/v1/contract_position_info',
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
  futureOrder: {
    method: 'POST',
    name: 'futureOrder',
    name_cn: '期货下单',
    sign: true,
    endpoint: 'api/v1/contract_order',
    accept: ['client_oid'],
    notNull: ['pair', 'contract_type', 'side', 'type', 'direction', 'lever_rate'],
    host: 'future',
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
  unfinishFutureOrders: {
    method: 'POST',
    name: 'unfinishFutureOrders',
    name_cn: '所有未完成的期货订单',
    endpoint: 'api/v1/contract_openorders',
    accept: ['pair'],
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
  futureOrderInfo: {
    method: 'POST',
    name: 'futureOrderInfo',
    name_cn: '期货订单信息',
    desc: '通过订单ID获取单个订单信息',
    endpoint: 'api/v1/contract_order_info',
    sign: true,
    accept: ['order_id', 'client_oid'],
    notNull: ['pair'],
    host: 'future',
  },
  spotFutureTransfer: {
    method: 'POST',
    name: 'spotFutureTransfer',
    name_cn: '期货现货划转',
    endpoint: 'v1/futures/transfer',
    sign: true,
    notNull: ['coin', 'source', 'target', 'amount'],
    rateLimit: 1000 / 10
  },
  // walletLedger: {
  //   name: 'walletLedger',
  //   name_cn: '流水',
  //   sign: true,
  //   endpoint: 'v1/query/deposit-withdraw',
  //   // host: 'future',
  // },
  // futureLedger: {
  //   method: 'POST',
  //   name: 'futureLedger',
  //   name_cn: '期货账户流水',
  //   endpoint: 'api/v1/contract_financial_record',
  //   notNull: ['coin'],
  //   accept: ['create_date'],
  //   host: 'future'
  // },
  // moveBalance: {
  //   method: 'POST',
  //   name: 'moveBalance',
  //   name_cn: '资金划转',
  //   endpoint: 'account/v3/transfer',
  //   sign: true,
  //   notNull: ['source', 'target', 'amount', 'coin']
  // },
  // withdrawHistory: {
  //   name: 'withdrawHistory',
  //   name_cn: '提币历史',
  //   endpoint: 'account/v3/withdrawal/history',
  //   sign: true,
  // },

  // // // // // // // // 现货部分  // // // // // // //
  // spotBalance: {
  //   name: 'spotBalance',
  //   name_cn: '余额',
  //   sign: true,
  //   endpoint: 'spot/v3/accounts/{coin}',
  //   endpointParams: ['coin'],
  //   notNull: ['coin']
  // },
  // spotBalances: {
  //   name: 'spotBalances',
  //   name_cn: '余额',
  //   sign: true,
  //   endpoint: 'spot/v3/accounts',
  //   notNull: [],
  // },
  // spotLedger: {
  //   name: 'spotLedger',
  //   name_cn: '现货账单流水查询',
  //   sign: true,
  //   endpoint: 'spot/v3/accounts/{coin}/ledger',
  //   endpointParams: ['coin'],
  //   access: ['from', 'to', 'limit'],
  //   notNull: ['coin']
  // },
  // spotOrder: {
  //   method: 'POST',
  //   name: 'spotOrder',
  //   name_cn: '现货买卖操作',
  //   desc: '',
  //   sign: true,
  //   endpoint: 'spot/v3/orders',
  //   notNull: ['type', 'side', 'pair'],
  //   rateLimit: 2000 / 100
  // },
  // cancelOrder: {
  //   method: 'POST',
  //   name: 'cancelOrder',
  //   name_cn: '撤销订单',
  //   endpoint: 'spot/v3/cancel_orders/{order_id}',
  //   endpointParams: ['order_id'],
  //   access: ['client_oid'],
  //   notNull: ['order_id', 'pair'],
  //   sign: true,
  //   rateLimit: 2000 / 100
  // },
  // batchCancelSpotOrders: {
  //   method: 'POST',
  //   name: 'batchCancelSpotOrders',
  //   name_cn: '撤销订单',
  //   desc: '最多4笔一次',
  //   endpoint: 'spot/v3/cancel_batch_orders',
  //   sign: true,
  //   // notNull: ['order_ids', 'pair'],
  //   rateLimit: 2000 / 50
  // },
  // spotOrderInfo: {
  //   method: 'GET',
  //   name: 'spotOrderInfo',
  //   sign: true,
  //   name_cn: '订单详情',
  //   endpoint: 'spot/v3/orders/{order_id}',
  //   endpointParams: ['order_id'],
  //   notNull: ['pair', 'order_id'],
  // },
  // orderDetail: {
  //   method: 'GET',
  //   name: 'orderDetail',
  //   name_cn: '成交订单详情',
  //   endpoint: 'spot/v3/fills',
  //   notNull: ['pair', 'order_id'],
  //   sign: true,
  // },
  // unfinishSpotOrders: {
  //   method: 'GET',
  //   name: 'unfinishSpotOrders',
  //   desc: '可以不区分pair地获取所有未成交订单',
  //   name_cn: '未成交订单',
  //   endpoint: 'spot/v3/orders_pending',
  //   sign: true,
  //   notNull: []
  // },
  // spotOrders: {
  //   method: 'GET',
  //   name: 'spotOrders',
  //   name_cn: '订单',
  //   desc: '区分pair地获取订单',
  //   endpoint: 'spot/v3/orders',
  //   notNull: ['pair'],
  //   sign: true,
  // },
  // // // // // // // // 杠杆交易  // // // // // // //
  // marginBalance: {
  //   name: 'marginBalance',
  //   name_cn: '杠杆账户余额',
  //   sign: true,
  //   endpoint: 'margin/v3/accounts',
  // },
  // marginCoins: {
  //   name: 'marginCoins',
  //   name_cn: '杠杆账户各币种信息',
  //   desc: '获取币币杠杆账户的借币配置信息，包括当前最大可借、借币利率、最大杠杆倍数',
  //   sign: true,
  //   endpoint: 'margin/v3/accounts/availability',
  // },
  // borrowHistory: {
  //   name: 'borrowHistory',
  //   name_cn: '借币记录',
  //   desc: '获取币币杠杆帐户的借币记录。这个请求支持分页，并且按时间倒序排序和存储，最新的排在最前面。请参阅分页部分以获取第一页之后的其他纪录',
  //   sign: true,
  //   defaultOptions: {
  //     limit: 100
  //   },
  //   endpoint: 'margin/v3/accounts/borrowed'
  // },
  // borrow: {
  //   method: 'POST',
  //   name: 'borrow',
  //   name_cn: '借币',
  //   desc: '在某个币币杠杆账户里进行借币',
  //   sign: true,
  //   endpoint: 'margin/v3/accounts/borrow',
  //   notNull: ['instrument_id', 'coin', 'amount']
  // },
  // repay: {
  //   method: 'POST',
  //   name: 'repay',
  //   name_cn: '还币',
  //   desc: '在某个币币杠杆账户里进行借币',
  //   sign: true,
  //   endpoint: 'margin/v3/accounts/repayment',
  //   notNull: ['instrument_id', 'coin', 'amount', 'order_id']
  // },
  // marginOrder: {
  //   method: 'POST',
  //   name: 'marginOrder',
  //   name_cn: '在借币账户内进行买卖操作',
  //   desc: '',
  //   sign: true,
  //   endpoint: 'margin/v3/orders',
  //   notNull: ['instrument_id', 'type', 'side']
  // },
  // cancelMarginOrder: {
  //   method: 'POST',
  //   name: 'cancelMarginOrder',
  //   name_cn: '撤销指定订单',
  //   sign: true,
  //   endpoint: 'margin/v3/cancel_orders/{order_id}',
  //   endpointParams: ['order_id'],
  //   notNull: ['order_id', 'instrument_id']
  // },
  // marginOrders: {
  //   sign: true,
  //   method: 'GET',
  //   name: 'marginOrders',
  //   defaultOptions: {
  //     status: 'all'
  //   },
  //   name_cn: '所有订单列表',
  //   endpoint: 'margin/v3/orders',
  //   notNull: ['instrument_id']
  // },
  // unfinishMarginOrders: {
  //   sign: true,
  //   method: 'GET',
  //   name: 'unfinishMarginOrders',
  //   name_cn: '获取所有未成交订单',
  //   endpoint: 'margin/v3/orders_pending',
  //   notNull: ['instrument_id']
  // },
  // marginOrderInfo: {
  //   method: 'GET',
  //   name: 'marginOrderInfo',
  //   name_cn: '获取单个订单信息',
  //   endpoint: 'margin/v3/orders/{order_id}',
  //   endpointParams: ['order_id'],
  //   notNull: ['instrument_id', 'order_id']
  // },
  // // successMarginOrders: {
  // //   method: 'GET',
  // //   name: 'successMarginOrders',
  // //   name_cn: '获取杠杆账户成交明细',
  // //   endpoint: 'margin/v3/fills',
  // // },
  // cancelAllMarginOrders: {
  //   method: 'POST',
  //   name: 'cancelAllMarginOrders',
  //   name_cn: '批量撤单',
  //   endpoint: 'margin/v3/cancel_batch_orders',
  //   notNull: ['instrument_id', 'order_ids']
  // },
  // // // // // // // // 合约部分  // // // // // // //
  // // 合约公共接口
  // futureTicks: {
  //   method: 'GET',
  //   name: 'futureTicks',
  //   name_cn: '期货所有tick',
  //   endpoint: 'futures/v3/instruments/ticker',
  //   rateLimit: 2000 / 20
  // },
  // futureTick: {
  //   method: 'GET',
  //   name: 'futureTick',
  //   name_cn: '期货单个tick',
  //   endpoint: 'futures/v3/instruments/{instrument_id}/ticker',
  //   endpointParams: ['instrument_id'],
  //   notNull: ['contract_type', 'pair'],
  //   rateLimit: 2000 / 20
  // },

  // futureLiquidation: {
  //   method: 'GET',
  //   name: 'futureLiquidation',
  //   name_cn: '爆仓单信息',
  //   endpoint: 'futures/v3/instruments/{instrument_id}/liquidation',
  //   endpointParams: ['instrument_id'],
  //   notNull: ['contract_type', 'pair', 'status'],
  // },

  // futureTotalHoldAmount: {
  //   method: 'GET',
  //   name: 'futureTotalHoldAmount',
  //   name_cn: '平台总持仓未挂单量',
  //   endpoint: 'futures/v3/accounts/{instrument_id}/holds',
  //   endpointParams: ['instrument_id'],
  //   notNull: ['contract_type', 'pair'],
  // },
  // setLerverate: {
  //   method: 'POST',
  //   name: 'setLerverate',
  //   name_cn: '设置币种的杠杆数',
  //   endpoint: 'futures/v3/accounts/{coin}/leverage',
  //   endpointParams: ['coin'],
  //   notNull: ['coin', 'lever_rate'],
  // },
  // lerverate: {
  //   method: 'GET',
  //   name: 'lerverate',
  //   name_cn: '币种的杠杆数',
  //   endpoint: 'futures/v3/accounts/{coin}/leverage',
  //   endpointParams: ['coin'],
  //   notNull: ['coin'],
  // },
  // futurePosition: {
  //   method: 'GET',
  //   name: 'futurePosition',
  //   name_cn: '单个期货仓位',
  //   endpointParams: ['instrument_id'],
  //   endpoint: 'futures/v3/{instrument_id}/position',
  //   notNull: ['contract_type', 'pair'],
  // },
  // futureBalances: {
  //   method: 'GET',
  //   name: 'futureBalances',
  //   name_cn: '期货账户余额',
  //   endpoint: 'futures/v3/accounts',
  //   notNull: []
  // },
  // futureBalance: {
  //   method: 'GET',
  //   name: 'futureBalance',
  //   name_cn: '期货账户余额(单币种)',
  //   endpoint: 'futures/v3/accounts/{coin}',
  //   endpointParams: ['coin'],
  //   notNull: ['coin']
  // },
  // // cancelFutureOrder: {
  // //   method: 'POST',
  // //   name: 'cancelFutureOrder',
  // //   name_cn: '期货撤单',
  // //   endpoint: 'futures/v3/cancel_order/{instrument_id}/{order_id}',
  // //   endpointParams: ['order_id', 'instrument_id'],
  // //   notNull: ['pair', 'contract_type', 'order_id'],
  // //   rateLimit: 2000 / 10
  // // },
  // batchCancelFutureOrders: {
  //   method: 'POST',
  //   name: 'batchCancelFutureOrders',
  //   name_cn: '撤销所有订单',
  //   endpoint: 'futures/v3/cancel_batch_orders/{instrument_id}',
  //   endpointParams: ['instrument_id'],
  //   // notNull: ['pair', 'contract_type', 'order_ids'],
  //   rateLimit: 2000 / 5
  // },
  // futureOrders: {
  //   method: 'GET',
  //   name: 'futureOrders',
  //   name_cn: '所有的期货订单',
  //   desc: '可以返回撤单成功、等待成交、部分成交、已完成的订单',
  //   endpointParams: ['instrument_id'],
  //   endpoint: 'futures/v3/orders/{instrument_id}',
  //   accept: ['from', 'to', 'limit'],
  //   notNull: ['status', 'pair', 'contract_type'],
  //   rateLimit: 2000 / 10,
  //   sign: true
  // },
  // unfinishFutureOrders: {
  //   method: 'GET',
  //   name: 'unfinishFutureOrders',
  //   name_cn: '所有未完成的期货订单',
  //   desc: '调用 ex.futureOrders()',
  //   endpointParams: ['instrument_id'],
  //   endpoint: 'futures/v3/orders/{instrument_id}',
  //   accept: ['from', 'to', 'limit'],
  //   notNull: ['pair', 'contract_type'],
  //   rateLimit: 2000 / 10
  // },
  // successFutureOrders: {
  //   method: 'GET',
  //   name: 'successFutureOrders',
  //   name_cn: '所有完成的期货订单',
  //   desc: '调用 ex.futureOrders()',
  //   endpointParams: ['instrument_id'],
  //   endpoint: 'futures/v3/orders/{instrument_id}',
  //   accept: ['from', 'to', 'limit'],
  //   notNull: ['pair', 'contract_type'],
  //   rateLimit: 2000 / 10
  // },

  // futurePairs: {
  //   method: 'GET',
  //   name: 'futurePairs',
  //   name_cn: '期货订单信息',
  //   desc: '获取可用合约的列表，查询各合约的交易限制和价格步长等信息',
  //   endpoint: 'futures/v3/instruments',
  //   rateLimit: 2000 / 20
  // },
  // futureLimitPrice: {
  //   method: 'GET',
  //   name: 'futureLimitPrice',
  //   name_cn: '期货限价',
  //   endpoint: 'futures/v3/instruments/{instrument_id}/price_limit',
  //   endpointParams: ['instrument_id'],
  //   notNull: ['pair', 'contract_type'],
  //   rateLimit: 2000 / 20
  // },
  // //
  // swapTicks: {
  //   method: 'GET',
  //   name: 'swapTicks',
  //   name_cn: '永续合约ticker',
  //   endpoint: 'swap/v3/instruments/ticker',
  //   rateLimit: 2000 / 20
  // },
};
