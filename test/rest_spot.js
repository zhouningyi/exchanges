const { testRest, live } = require('./utils');

const exchanges = ['okexV3']; // bikicoin
// Bikicoin
// , 'okex'. 'hitbtc' 'bittrex'， fcoin coinall


const tasks = [
  // {
  //   fn: 'spotOrder',
  //   params: {
  //     client_oid: `order${Math.floor(Math.random() * 10000)}`,
  //     pair: 'BSV-USDT',
  //     type: 'LIMIT',
  //     side: 'BUY',
  //     order_type: 'MAKER',
  //     price: 190,
  //     amount: 0.01
  //   }
  // },
  // {
  //   fn: 'spotOrders',
  //   params: {
  //     pair: 'XRP-USDT',
  //   }
  // },
  // {
  //   fn: 'unfinishSpotOrders',
  //   params: {
  //     pair: 'XRP-USDT',
  //   }
  // },
  // {
  //   fn: 'batchCancelSpotOrders',
  //   params: {
  //     pair: 'XRP-USDT',
  //   }
  // },

  // {
  //   fn: 'spotBalance',
  //   params: {
  //     coin: 'USDT'
  //   },
  //   name: '现货账户信息'
  // },
  // {
  //   fn: 'pointBalance',
  //   params: {},
  //   name: '点卡账户信息'
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
  //   fn: 'time',
  //   params: {},
  //   name: '时间1'
  // },
  // {
  //   fn: 'swapTicks',
  //   name: '永续合约行情'
  // },
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
  // {
  //   fn: 'cancelAllMarginOrders',
  //   params: {
  //     instrument_id: 'ETH-USDT',
  //     order_ids: ['1776998403941376', '1777001486755840']
  //   }
  // },
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
  //   fn: 'spotLedger',
  //   params: {
  //     coin: 'BTC',
  //     limit: 21,
  //   }
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
  //     pair: 'ETH-USDT',
  //     amount: 0.1,
  //     price: '100',
  //     side: 'BUY',
  //     type: 'LIMIT'
  //   },
  //   name: '交易'
  // },
  // {
  //   fn: 'cancelOrder',
  //   params: {
  //     order_id: '1821919279130624',
  //     pair: 'ETH-USDT',
  //   },
  //   name: '取消交易'
  // },

  // {
  //   fn: 'walletLedger'
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
  //   fn: 'marginBalance',
  //   params: {
  //     notNull: true
  //   },
  //   name: '杠杆账户余额'
  // },
  // {
  //   fn: 'marginCoins',
  //   params: {},
  //   name: '杠杆账户各币种信息'
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
  //   fn: 'spotTicks',
  //   params: { pair: 'BTC-USDT' },
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
  //   fn: 'depth',
  //   params: { pair: 'ETH-BTC', size: 5 },
  //   name: '深度'
  // },

  // {
  //   fn: 'spotKline',
  //   params: { pair: 'ETH-BTC', interval: '1m' },
  //   name: 'spot kline'
  // },
  // {
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
  // {
  //   fn: 'unfinishOrders',
  //   params: {
  //     // pair: 'ETH-USDT'
  //     limit: 3
  //   }
  // },
  // {
  //   fn: 'cancelAllOrders',
  //   params: {
  //     pair: 'ETH-USDT',
  //     order_ids: [1821901508649984]
  //   },
  //   name: '批量取消正在执行中的订单'
  // },
  // {
  //   fn: 'orderInfo',
  //   params: {
  //     pair: 'ETH-USDT',
  //     order_id: '1821901508649984',
  //   },
  //   name: '交易'
  // },
  // {
  //   fn: 'orders',
  //   params: {
  //     pair: 'ETH-USDT',
  //     status: 'SUCCESS',
  //     limit: 1
  //   },
  //   name: '所有的订单'
  // },
  // {
  //   fn: 'orderDetail',
  //   params: {
  //     order_id: '1823534205716480',
  //     pair: 'ETH-USDT'
  //   },
  // },

];

testRest(exchanges, tasks);
live();
