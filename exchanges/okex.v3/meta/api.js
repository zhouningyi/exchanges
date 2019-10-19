
const Utils = require('./../utils');

module.exports = {
  // order: {
  //   timeout: 5000,
  //   rateLimit: 110,
  //   retry: 0
  // },
  // futureOrder: {
  //   timeout: 5000,
  //   rateLimit: 110,
  //   retry: 0
  // },
  // cancelOrder: {
  //   timeout: 15000,
  //   rateLimit: 110,
  //   retry: 2
  // },
  // futureBalances: {
  //   timeout: 5000,
  //   rateLimit: 220,
  //   retry: 3
  // },
  // futurePosition: {
  //   timeout: 5000,
  //   rateLimit: 220,
  //   retry: 3
  // },
  // unfinishedOrderInfo: {
  //   timeout: 5000,
  //   rateLimit: 220,
  //   retry: 3
  // },
  // balances: {
  //   timeout: 5000,
  //   rateLimit: 366,
  //   retry: 3
  // },
  // unfinishedFutureOrderInfo: {
  //   timeout: 5000,
  //   rateLimit: 366,
  //   retry: 3
  // },
  // allFutureOrders: {
  //   timeout: 5000,
  //   rateLimit: 366,
  //   retry: 3
  // },
  // allOrders: {
  //   timeout: 5000,
  //   rateLimit: 366,
  //   retry: 3
  // },
  // cancelFutureOrder: {
  //   timeout: 15000,
  //   rateLimit: 550,
  //   retry: 2
  // },
  //
  // // // // // // // 公共部分  // // // // // // //
  coins: {
    name: 'coins',
    name_cn: '币种信息',
    sign: false,
    endpoint: 'account/v3/currencies',
    desc: '获取平台所有币种列表。并非所有币种都可被用于交易。在ISO 4217标准中未被定义的币种代码可能使用的是自定义代码',
    notNull: [],
  },
  moveBalance: {
    method: 'POST',
    name: 'moveBalance',
    name_cn: '资金划转',
    endpoint: 'account/v3/transfer',
    sign: true,
    notNull: ['source', 'target', 'amount', 'coin']
  },
  withdrawHistory: {
    name: 'withdrawHistory',
    name_cn: '提币历史',
    endpoint: 'account/v3/withdrawal/history',
    sign: true,
  },
  walletLedger: {
    name: 'walletLedger',
    name_cn: '流水',
    sign: true,
    endpoint: 'account/v3/ledger',
  },
  // // // // // // // 现货部分  // // // // // // //
  spotBalance: {
    name: 'spotBalance',
    name_cn: '余额',
    sign: true,
    endpoint: 'spot/v3/accounts/{coin}',
    endpointParams: ['coin'],
    notNull: ['coin']
  },
  spotBalances: {
    name: 'spotBalances',
    name_cn: '余额',
    sign: true,
    endpoint: 'spot/v3/accounts',
    notNull: [],
  },
  pairs: {
    name: 'pairs',
    name_cn: '币对信息',
    endpoint: 'spot/v3/instruments',
  },
  spotLedger: {
    name: 'spotLedger',
    name_cn: '现货账单流水查询',
    sign: true,
    endpoint: 'spot/v3/accounts/{coin}/ledger',
    endpointParams: ['coin'],
    access: ['from', 'to', 'limit'],
    notNull: ['coin']
  },
  spotOrder: {
    method: 'POST',
    name: 'spotOrder',
    name_cn: '现货买卖操作',
    desc: '',
    sign: true,
    endpoint: 'spot/v3/orders',
    notNull: ['type', 'side', 'pair'],
    rateLimit: 2000 / 100
  },
  cancelOrder: {
    method: 'POST',
    name: 'cancelOrder',
    name_cn: '撤销订单',
    endpoint: 'spot/v3/cancel_orders/{order_id}',
    endpointParams: ['order_id'],
    access: ['client_oid'],
    notNull: ['order_id', 'pair'],
    sign: true,
    rateLimit: 2000 / 100
  },
  batchCancelSpotOrders: {
    method: 'POST',
    name: 'batchCancelSpotOrders',
    name_cn: '撤销订单',
    desc: '最多4笔一次',
    endpoint: 'spot/v3/cancel_batch_orders',
    sign: true,
    // notNull: ['order_ids', 'pair'],
    rateLimit: 2000 / 50
  },
  spotOrderInfo: {
    method: 'GET',
    name: 'spotOrderInfo',
    sign: true,
    name_cn: '订单详情',
    endpoint: 'spot/v3/orders/{order_id}',
    endpointParams: ['order_id'],
    notNull: ['pair', 'order_id'],
  },
  orderDetail: {
    method: 'GET',
    name: 'orderDetail',
    name_cn: '成交订单详情',
    endpoint: 'spot/v3/fills',
    notNull: ['pair', 'order_id'],
    sign: true,
  },
  unfinishSpotOrders: {
    method: 'GET',
    name: 'unfinishSpotOrders',
    desc: '可以不区分pair地获取所有未成交订单',
    name_cn: '未成交订单',
    endpoint: 'spot/v3/orders_pending',
    sign: true,
    notNull: []
  },
  spotOrders: {
    method: 'GET',
    name: 'spotOrders',
    name_cn: '订单',
    desc: '区分pair地获取订单',
    endpoint: 'spot/v3/orders',
    notNull: ['pair'],
    sign: true,
  },
  // // // // // // // 杠杆交易  // // // // // // //
  marginBalances: {
    name: 'marginBalances',
    name_cn: '所有杠杆账户余额',
    sign: true,
    endpoint: 'margin/v3/accounts',
  },
  marginBalance: {
    name: 'marginBalance',
    name_cn: '单个杠杆账户余额',
    sign: true,
    endpointParams: ['coin'],
    endpoint: 'margin/v3/accounts/{coin}',
    notNull: ['coin']
  },
  marginPairInfo: {
    name: 'marginPairInfo',
    name_cn: '杠杆账户各币种信息',
    desc: '获取币币杠杆账户的借币配置信息，包括当前最大可借、借币利率、最大杠杆倍数',
    sign: true,
    endpoint: 'margin/v3/accounts/availability',
  },
  borrowHistory: {
    name: 'borrowHistory',
    name_cn: '借币记录',
    desc: '获取币币杠杆帐户的借币记录。这个请求支持分页，并且按时间倒序排序和存储，最新的排在最前面。请参阅分页部分以获取第一页之后的其他纪录',
    sign: true,
    defaultOptions: {
      limit: 100
    },
    // notNull: ['pair'],
    endpoint: 'margin/v3/accounts/borrowed'
  },
  borrow: {
    method: 'POST',
    name: 'borrow',
    name_cn: '借币',
    desc: '在某个币币杠杆账户里进行借币',
    sign: true,
    endpoint: 'margin/v3/accounts/borrow',
    notNull: ['instrument_id', 'coin', 'amount']
  },
  repay: {
    method: 'POST',
    name: 'repay',
    name_cn: '还币',
    desc: '在某个币币杠杆账户里进行借币',
    sign: true,
    endpoint: 'margin/v3/accounts/repayment',
    notNull: ['pair', 'coin', 'amount']
  },
  marginOrder: {
    method: 'POST',
    name: 'marginOrder',
    name_cn: '在借币账户内进行买卖操作',
    desc: '',
    sign: true,
    endpoint: 'margin/v3/orders',
    notNull: ['pair', 'type', 'side']
  },
  cancelMarginOrder: {
    method: 'POST',
    name: 'cancelMarginOrder',
    name_cn: '撤销指定订单',
    sign: true,
    endpoint: 'margin/v3/cancel_orders/{order_id}',
    endpointParams: ['order_id'],
    notNull: ['order_id', 'instrument_id']
  },
  batchCancelMarginOrder: {
    method: 'POST',
    name: 'cancelMarginOrder',
    name_cn: '撤销指定订单',
    sign: true,
    endpoint: 'margin/v3/cancel_batch_orders',
    // notNull: ['pair']
  },
  batchCancelMarginOrders: {
    method: 'POST',
    name: 'batchCancelMarginOrders',
    name_cn: '批量撤销订单',
    sign: true,
    endpoint: 'margin/v3/cancel_batch_orders',
    // notNull: ['pair']
  },
  marginOrders: {
    sign: true,
    method: 'GET',
    name: 'marginOrders',
    defaultOptions: {
      status: 'all'
    },
    name_cn: '所有订单列表',
    endpoint: 'margin/v3/orders',
    notNull: ['instrument_id']
  },
  unfinishMarginOrders: {
    sign: true,
    method: 'GET',
    name: 'unfinishMarginOrders',
    name_cn: '获取所有未成交订单',
    endpoint: 'margin/v3/orders_pending',
    notNull: []
  },
  marginOrderInfo: {
    method: 'GET',
    name: 'marginOrderInfo',
    name_cn: '获取单个订单信息',
    endpoint: 'margin/v3/orders/{order_id}',
    endpointParams: ['order_id'],
    notNull: ['pair', 'order_id']
  },
  // successMarginOrders: {
  //   method: 'GET',
  //   name: 'successMarginOrders',
  //   name_cn: '获取杠杆账户成交明细',
  //   endpoint: 'margin/v3/fills',
  // },
  cancelAllMarginOrders: {
    method: 'POST',
    name: 'cancelAllMarginOrders',
    name_cn: '批量撤单',
    endpoint: 'margin/v3/cancel_batch_orders',
    notNull: ['instrument_id', 'order_ids']
  },
  // // // // // // // 合约部分  // // // // // // //
  // 合约公共接口
  futureTicks: {
    method: 'GET',
    name: 'futureTicks',
    name_cn: '期货所有tick',
    endpoint: 'futures/v3/instruments/ticker',
    rateLimit: 2000 / 20
  },
  futureTick: {
    method: 'GET',
    name: 'futureTick',
    name_cn: '期货单个tick',
    endpoint: 'futures/v3/instruments/{instrument_id}/ticker',
    endpointParams: ['instrument_id'],
    notNull: ['contract_type', 'pair'],
    rateLimit: 2000 / 20
  },
  futureIndex: {
    method: 'GET',
    name: 'futureIndex',
    name_cn: '期货指数',
    endpoint: 'futures/v3/instruments/{instrument_id}/index',
    endpointParams: ['instrument_id'],
    notNull: ['contract_type', 'pair'],
    rateLimit: 2000 / 20
  },
  futureLiquidation: {
    method: 'GET',
    name: 'futureLiquidation',
    name_cn: '爆仓单信息',
    endpoint: 'futures/v3/instruments/{instrument_id}/liquidation',
    endpointParams: ['instrument_id'],
    notNull: ['contract_type', 'pair', 'status'],
  },
  futureTotalAmount: {
    method: 'GET',
    name: 'futureTotalAmount',
    name_cn: '平台总持仓',
    endpoint: 'futures/v3/instruments/{instrument_id}/open_interest',
    endpointParams: ['instrument_id'],
    notNull: ['contract_type', 'pair'],
  },
  futureTotalHoldAmount: {
    method: 'GET',
    name: 'futureTotalHoldAmount',
    name_cn: '平台总持仓未挂单量',
    endpoint: 'futures/v3/accounts/{instrument_id}/holds',
    endpointParams: ['instrument_id'],
    notNull: ['contract_type', 'pair'],
  },
  // 合约私有接口
  futurePositions: {
    method: 'GET',
    name: 'futurePositions',
    name_cn: '所有期货仓位',
    endpoint: 'futures/v3/position',
    notNull: []
  },
  setLerverate: {
    method: 'POST',
    name: 'setLerverate',
    name_cn: '设置币种的杠杆数',
    endpoint: 'futures/v3/accounts/{coin}/leverage',
    endpointParams: ['coin'],
    notNull: ['coin', 'lever_rate'],
  },
  setMarginMode: {
    method: 'POST',
    name: 'setMarginMode',
    name_cn: '设置仓位类型',
    endpoint: 'futures/v3/accounts/margin_mode',
    notNull: ['coin', 'margin_mode'],
  },
  lerverate: {
    method: 'GET',
    name: 'lerverate',
    name_cn: '币种的杠杆数',
    endpoint: 'futures/v3/accounts/{coin}/leverage',
    endpointParams: ['coin'],
    notNull: ['coin'],
  },
  futurePosition: {
    method: 'GET',
    name: 'futurePosition',
    name_cn: '单个期货仓位',
    endpointParams: ['instrument_id'],
    endpoint: 'futures/v3/{instrument_id}/position',
    notNull: ['contract_type', 'pair'],
  },
  futureBalances: {
    method: 'GET',
    name: 'futureBalances',
    name_cn: '期货账户资产',
    endpoint: 'futures/v3/accounts',
    notNull: []
  },
  futureBalance: {
    method: 'GET',
    name: 'futureBalance',
    name_cn: '期货账户资产(单币种)',
    endpoint: 'futures/v3/accounts/{coin}',
    endpointParams: ['coin'],
    notNull: ['coin']
  },
  futureLedger: {
    method: 'GET',
    name: 'futureLedger',
    name_cn: '期货账户流水',
    endpoint: 'futures/v3/accounts/{coin}/ledger',
    endpointParams: ['coin'],
    notNull: ['pair'],
    rateLimit: 2000 / 5
  },
  futureOrder: {
    method: 'POST',
    name: 'futureOrder',
    name_cn: '期货下单',
    sign: true,
    endpoint: 'futures/v3/order',
    accept: ['client_oid'],
    notNull: ['pair', 'contract_type', 'side', 'type', 'direction', 'lever_rate'],
    rateLimit: 2000 / 20
  },
  // cancelFutureOrder: {
  //   method: 'POST',
  //   name: 'cancelFutureOrder',
  //   name_cn: '期货撤单',
  //   endpoint: 'futures/v3/cancel_order/{instrument_id}/{order_id}',
  //   endpointParams: ['order_id', 'instrument_id'],
  //   notNull: ['pair', 'contract_type', 'order_id'],
  //   rateLimit: 2000 / 10
  // },
  batchCancelFutureOrders: {
    method: 'POST',
    name: 'batchCancelFutureOrders',
    name_cn: '撤销所有订单',
    endpoint: 'futures/v3/cancel_batch_orders/{instrument_id}',
    endpointParams: ['instrument_id'],
    // notNull: ['pair', 'contract_type', 'order_ids'],
    rateLimit: 2000 / 5
  },
  futureOrders: {
    method: 'GET',
    name: 'futureOrders',
    name_cn: '所有的期货订单',
    desc: '可以返回撤单成功、等待成交、部分成交、已完成的订单',
    endpointParams: ['instrument_id'],
    endpoint: 'futures/v3/orders/{instrument_id}',
    accept: ['from', 'to', 'limit'],
    notNull: ['status', 'pair', 'contract_type'],
    rateLimit: 2000 / 10,
    sign: true
  },
  unfinishFutureOrders: {
    method: 'GET',
    name: 'unfinishFutureOrders',
    name_cn: '所有未完成的期货订单',
    desc: '调用 ex.futureOrders()',
    endpointParams: ['instrument_id'],
    endpoint: 'futures/v3/orders/{instrument_id}',
    accept: ['from', 'to', 'limit'],
    notNull: ['pair', 'contract_type'],
    rateLimit: 2000 / 10
  },
  successFutureOrders: {
    method: 'GET',
    name: 'successFutureOrders',
    name_cn: '所有完成的期货订单',
    desc: '调用 ex.futureOrders()',
    endpointParams: ['instrument_id'],
    endpoint: 'futures/v3/orders/{instrument_id}',
    accept: ['from', 'to', 'limit'],
    notNull: ['pair', 'contract_type'],
    rateLimit: 2000 / 10
  },
  futureOrderInfo: {
    method: 'GET',
    name: 'futureOrderInfo',
    name_cn: '期货订单信息',
    desc: '通过订单ID获取单个订单信息',
    endpoint: 'futures/v3/orders/{instrument_id}/{order_id}',
    endpointParams: ['instrument_id', 'order_id'],
    rateLimit: 2000 / 10
  },
  futurePairs: {
    method: 'GET',
    name: 'futurePairs',
    name_cn: '期货订单信息',
    desc: '获取可用合约的列表，查询各合约的交易限制和价格步长等信息',
    endpoint: 'futures/v3/instruments',
    rateLimit: 2000 / 20
  },
  futureLimitPrice: {
    method: 'GET',
    name: 'futureLimitPrice',
    name_cn: '期货限价',
    endpoint: 'futures/v3/instruments/{instrument_id}/price_limit',
    endpointParams: ['instrument_id'],
    notNull: ['pair', 'contract_type'],
    rateLimit: 2000 / 20
  },
  futureKline: {
    method: 'GET',
    name: 'futureKline',
    name_cn: '期货K线图',
    endpoint: 'futures/v3/instruments/{instrument_id}/candles',
    endpointParams: ['instrument_id'],
    notNull: ['pair', 'contract_type'],
    rateLimit: 2000 / 20
  },
  //
  swapTicks: {
    method: 'GET',
    name: 'swapTicks',
    name_cn: '永续合约ticker',
    endpoint: 'swap/v3/instruments/ticker',
    rateLimit: 2000 / 20
  },
};
