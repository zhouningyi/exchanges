
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
  ledger: {
    name: 'ledger',
    name_cn: '流水',
    sign: true,
    endpoint: 'account/v3/ledger',
  },
  balances: {
    name: 'balances',
    name_cn: '余额',
    sign: true,
    endpoint: 'spot/v3/accounts',
    notNull: [],
  },
  coins: {
    name: 'coins',
    name_cn: '币种信息',
    sign: false,
    endpoint: 'account/v3/currencies',
    desc: '获取平台所有币种列表。并非所有币种都可被用于交易。在ISO 4217标准中未被定义的币种代码可能使用的是自定义代码',
    notNull: [],
  },
  marginBalance: {
    name: 'marginBalance',
    name_cn: '杠杆账户余额',
    sign: true,
    endpoint: 'margin/v3/accounts',
  },
  marginCoins: {
    name: 'marginCoins',
    name_cn: '杠杆账户各币种信息',
    desc: '获取币币杠杆账户的借币配置信息，包括当前最大可借、借币利率、最大杠杆倍数',
    sign: false,
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
    notNull: ['instrument_id', 'coin', 'amount', 'order_id']
  },
  marginOrder: {
    method: 'POST',
    name: 'marginOrder',
    name_cn: '在借币账户内进行买卖操作',
    desc: '',
    sign: true,
    endpoint: 'margin/v3/orders',
    notNull: ['instrument_id', 'type', 'side']
  },
  cancelMarginOrder: {
    method: 'POST',
    name: 'cancelMarginOrder',
    name_cn: '撤销指定订单',
    endpoint: 'margin/v3/cancel_orders/{order_id}',
    endpointParams: ['order_id'],
    notNull: ['order_id', 'instrument_id']
  },
  marginOrders: {
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
    method: 'GET',
    name: 'unfinishMarginOrders',
    name_cn: '获取所有未成交订单',
    endpoint: 'margin/v3/orders_pending',
    notNull: ['instrument_id']
  },
  marginOrderInfo: {
    method: 'GET',
    name: 'marginOrderInfo',
    name_cn: '获取单个订单信息',
    endpoint: 'margin/v3/orders/{order_id}',
    endpointParams: ['order_id'],
    notNull: ['instrument_id', 'order_id']
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
  futurePosition: {
    method: 'GET',
    name: 'futurePosition',
    name_cn: '期货仓位',
    endpoint: 'futures/v3/position',
    notNull: []
  },
  futureBalances: {
    method: 'GET',
    name: 'futureBalances',
    name_cn: '期货账户余额',
    endpoint: 'futures/v3/accounts',
    notNull: []
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
    endpoint: 'futures/v3/order',
    notNull: ['instrument_id', 'contract_type', 'side', 'direction', 'lever_rate'],
    rateLimit: 2000 / 20
  }
};
