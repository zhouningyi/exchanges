const { testRest, live } = require('./utils');

const exchanges = ['okexV3']; // bikicoin
// Bikicoin
// , 'okex'. 'hitbtc' 'bittrex'， fcoin coinall

const tasks = [
  // {
  //   fn: 'time',
  //   params: {},
  //   name: '服务器时间'
  // },
  // {
  //   fn: 'moveBalance',
  //   params: {
  //     coin: 'USDT',
  //     instrument_id: 'ETH-USDT',
  //     amount: 11,
  //     source: 'spot',
  //     target: 'margin'
  //   },
  //   name: '资金移动'
  // },
  // {
  //   fn: 'borrowHistory',
  //   params: {
  //     status: 'payoff'
  //   },
  // },
  // {
  //   fn: 'borrow',
  //   params: {
  //     instrument_id: 'ETH-USDT',
  //     coin: 'ETH',
  //     amount: 0.11
  //   }
  // },
  // {
  //   fn: 'repay',
  //   params: {
  //     client_oid: 'xxx',
  //     order_id: '250265',
  //     instrument_id: 'ETH-USDT',
  //     coin: 'ETH',
  //     amount: 0.11
  //   }
  // },
  // {
  //   fn: 'marginOrder',
  //   params: {
  //     client_oid: 'xxxx',
  //     instrument_id: 'ETH-USDT',
  //     type: 'LIMIT',
  //     side: 'BUY',
  //     price: 100,
  //     amount: 0.1
  //   }
  // },
  // {
  //   fn: 'cancelMarginOrder',
  //   params: {
  //     instrument_id: 'ETH-USDT',
  //     order_id: '1776996762192896',
  //   }
  // },
  {
    fn: 'cancelAllMarginOrders',
    params: {
      instrument_id: 'ETH-USDT',
      order_ids: ['1776998403941376', '1777001486755840']
    }
  },
  // {
  //   fn: 'unfinishMarginOrders',
  //   params: {
  //     instrument_id: 'ETH-USDT',
  //   }
  // },
  // {
  //   fn: 'marginOrderInfo',
  //   params: {
  //     instrument_id: 'ETH-USDT',
  //     order_id: '1776998403941376'
  //   }
  // },
  // {
  //   fn: 'withdrawHistory',
  //   params: {
  //   },
  //   name: '提币记录'
  // },
  // {
  //   fn: 'marginOrders',
  //   params: {
  //     status: 'UNFINISH',
  //     instrument_id: 'ETH-USDT',
  //   },
  //   name: '所有的margin订单'
  // },
  // {
  //   fn: 'ledger',
  //   params: {
  //   },
  //   name: '流水'
  // },
  // {
  //   fn: 'trades',
  //   params: {
  //     pair: 'WFEE-USDT',
  //   },
  //   name: 'trades 交易历史'
  // },
  // {
  //   fn: 'order',
  //   params: {
  //     pair: 'WFEE-USDT',
  //     amount: 200.212113333322212,
  //     price: '0.00026',
  //     side: 'BUY',
  //     type: 'LIMIT'
  //   },
  //   name: '交易'
  // },
  // {
  //   fn: 'cancelOrder',
  //   params: {
  //     order_id: '2318947',
  //     pair: 'ETH-USDT',
  //   },
  //   name: '取消交易'
  // // },
  // {
  //   fn: 'orders',
  //   params: {
  //     pair: 'ETH-USDT',
  //   },
  //   name: '所有的订单'
  // },


  // {
  //   fn: 'fastOrder',
  //   params: {
  //     pair: 'ETH-BTC',
  //     amount: 0.02,
  //     price: 0.05,
  //     side: 'BUY',
  //     type: 'LIMIT'
  //   },
  //   name: '交易'
  // },
  // {
  //   fn: 'cancelAllOrders',
  //   params: {
  //     pair: 'ETH-USDT'
  //   },
  //   name: '取消正在执行中的订单'
  // },
  // {
  //   fn: 'activeOrders',
  //   params: {
  //     pair: 'ETH-USDT'
  //   },
  //   name: '正在执行中的订单'
  // },
  // {
  //   fn: 'successOrders',
  //   params: {
  //     pair: 'OKB-USDT'
  //   },
  //   name: '已经完成的订单'
  // },
  // {
  //   fn: 'orderInfo',
  //   params: {
  //     pair: 'WFEE-USDT',
  //     order_id: '44527',
  //   },
  //   name: '交易'
  // },
  // {
  //   fn: 'pairs',
  //   params: {},
  //   name: '交易对信息'
  // },
  // {
  //   fn: 'coins',
  //   params: {},
  //   name: '币信息'
  // },
  // {
  //   fn: 'marginBalance',
  //   params: {
  //     notNull: true
  //   },
  //   name: '杠杆账户余额'
  // },
  // {
  //   fn: 'marginCoins',
  //   params: {},
  //   name: '杠杆账户余额'
  // },
  // {
  //   fn: 'tick',
  //   params: { pair: 'ETH-USDT' },
  //   name: 'tick数据'
  // },
  // {
  //   fn: 'funding',
  //   params: {},
  //   name: 'bitmex 互换资费'
  // },
  // {
  //   fn: 'ticks',
  //   params: { pair: 'OKB-USDT' },
  //   name: 'ticks数据'
  // },

  // {
  //   fn: 'accounts',
  //   params: {},
  //   name: 'accounts'
  // },
  // {
  //   fn: 'balances',
  //   params: {
  //     // pair: 'USDT'
  //   },
  //   name: '账户余额'
  // },
  // {
  //   fn: 'wallet',
  //   params: {
  //     notNull: true
  //   },
  //   name: '钱包'
  // },
  // {
  //   fn: 'futureBalances',
  //   params: {},
  //   name: '合约(全仓)余额'
  // },
  // {
  //   fn: 'depth',
  //   params: { pair: 'ETH-BTC', size: 5 },
  //   name: '深度'
  // },

  // {
  //   fn: 'kline',
  //   params: { pair: 'ETH-BTC', interval: '1m' },
  //   name: 'orderBook数据'
  // },
// / {
//   fn: 'orderBook',
//   params: { pair: 'ETH-BTC' },
//   name: 'orderBook数据'
// },
  // {
  //   fn: 'unfinishedOrderInfo',
  //   params: { pair: 'ETH-USDT' },
  //   name: 'orderBook未成交的订单'
  // },
  // {
  //   fn: 'allOrders',
  //   params: {
  //     pair: 'BCH-USDT',
  //   },
  //   name: 'allOrders'
  // },
];

testRest(exchanges, tasks);
live();
