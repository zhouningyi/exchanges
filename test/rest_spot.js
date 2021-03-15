const { testRest, live } = require('./utils');

const exchanges = ['huobi']; // bikicoin
// Bikicoin
// , 'okex'. 'hitbtc' 'bittrex'， fcoin coinall
//
const assets = [{ pair: 'ETH-USD', asset_type: 'SWAP' }, { pair: 'ETC-USD', asset_type: 'NEXT_QUARTER' }, { pair: 'BTC-USDT', asset_type: 'SPOT' }];
const spotOrderO = { client_oid: `order${Math.floor(Math.random() * 10000)}`, pair: 'ETH-USDT', asset_type: 'SPOT', type: 'LIMIT', side: 'SELL', order_type: 'MAKER', price: '2290.0', amount: 0.1 };
const futureOrderO = { pair: 'ETH-USD', asset_type: 'THIS_WEEK', client_oid: `OKEX${Math.round(Math.random() * 1000000)}`, lever_rate: 5, side: 'BUY', direction: 'UP', amount: 1, type: 'LIMIT', price: 1000 };
const swapOrderO = { pair: 'ETH-USD', asset_type: 'SWAP', client_oid: `OKEX${Math.round(Math.random() * 1000000)}`, side: 'BUY', direction: 'UP', amount: 1, type: 'LIMIT', price: 1000 };
const newtasks = [
  // ['accountBalance', { base_coin: 'BTC', account_type: 'spot' }],
  // ['cancelAssetOrder', { order_id: '22074158437' }],
  // ['volatilityHistory', { coin: 'BTC' }],
  // ['coinContractOrders', { pair: 'BTC-USD', asset_type: 'QUARTER' }],
  // ['coinContractOrder', { pair: 'BTC-USD', asset_type: 'QUARTER', type: 'limit', direction: 'LONG', side: 'BUY', price: 10000, amount: 1, client_oid: 'x2xfffs' }],
  // ['coinContractBatchCancelOrder', { pair: 'BTC-USD', asset_type: 'QUARTER', order_ids: [562672879, 562673242] }],
  // ['coinContractCancelOrder', { pair: 'BTC-USD', asset_type: 'SWAP', client_oid: 'HLpkQ3lMl9qziInAabQ7cn' }],
  // ['coinContractOrderInfo', { pair: 'BTC-USD', asset_type: 'QUARTER', order_id: 562672879 }],
  // ['coinContracUnfinishedtOrders', { pair: 'BTC-USD', asset_type: 'QUARTER' }],
  // ['coinContractUnfinishedOrderHistory', { pair: 'BTC-USD', asset_type: 'QUARTER' }],
  // ['coinContractBalances', { coin: 'BTC' }],
  // ['coinContractOrderDetails', { pair: 'BTC-USD', asset_type: 'QUARTER' }],
  // ['coinContractPositionsRisk', {}],
  //
  // ['usdtContractAssets', {}],
  // ['usdtContractKline', { pair: 'BTC-USDT', interval: '1m' }],
  // ['usdtContractBalances', {}],
    // ['usdtContractPositions', {}],
    // ['usdtContractOrders', { pair: 'BTC-USDT', asset_type: 'SWAP' }],
    // ['usdtContractOrder', { pair: 'BTC-USDT', asset_type: 'SWAP', type: 'limit', direction: 'LONG', side: 'BUY', price: 10000, amount: 0.001, client_oid: 'x2xff23fs' }],
    // ['usdtContractCancelOrder', { order_id: '10977489552', pair: 'BTC-USDT', asset_type: 'SWAP' }],
      // ['usdtContractOrderInfo', { order_id: '10981094762', pair: 'BTC-USDT', asset_type: 'SWAP' }],
      // ['usdtContractUnfinishOrders', { pair: 'BTC-USDT', asset_type: 'SWAP' }],
      // ['usdtContractOrderDetails', { pair: 'BTC-USDT', asset_type: 'SWAP' }],
      // ['usdtContractListenKey', {}],
      // ['usdtContractUpdateLeverate', { asset_type: 'SWAP', pair: 'BTC-USDT', lever_rate: 6 }],
  // ['spotMoveBalance', { target: 'SPOT', source: 'COIN_CONTRACT', coin: 'BTC', amount: 0.001 }],
  // ['updateCoinContractListenKey', {}],
    // ['coinContractPositions', {}],
    // ['spotSystemStatus', {}],
    // ['spotAssets', {}],
    // ['time', {}],
    // ['spotListenKey', {}],
        // ['futureMoveBalance', { source: 'FUTURE', target: 'SPOT', amount: 0.1, coin: 'EOS' }],
      // ['moveBalance', { source: 'SPOT', target: 'COIN_CONTRACT', amount: 0.001, coin: 'BTC' }],
    // //////////////////////////////SPOT//////////////////////////////////////////////////
    // ['spotKline', { pair: 'BTC-USDT', interval: '15m' }],
    // ['spotBalances', { }],
    // ['spotOrders', { pair: 'BTC-USDT' }],
    // ['spotMoveBalance', { coin: 'USDT', instrument_id: 'ETH-USDT', amount: 11, source: 'spot', target: 'margin' }],
    // ['spotBalance', {}],
    // ['spotUnfinishOrders', { pair: 'BTC-USDT' }],
    // ['spotOrderDetails', { pair: 'EOS-USDT' }],
    // ['assetOrderDetails', { pair: 'EOS-USDT', exchange: 'HUOBI', asset_type: 'SPOT' }],
    // ['assetOrderDetails', { pair: 'EOS-USD', exchange: 'HUOBI', asset_type: 'QUARTER' }],
    // ['spotOrder', { client_oid: `order${Math.floor(Math.random() * 10000)}`, pair: 'BTC-USDT', type: 'LIMIT', side: 'SELL', order_type: 'MAKER', price: '30000', amount: '0.001' }],
    // ['spotCancelOrderByOrderId', { order_id: '146927075055460' }]
    // ['spotCancelOrder', { client_oid: 'order1584', pair: 'BTC-USDT' }],
    // ['spotCancelOrderByClientOrderId', { client_oid: 'order8072' }]
    // ['spotOrderInfoByOrderId', { order_id: 146927452656883 }],
    // ['spotOrderInfoByClientOrderId', { client_oid: 'order925' }],
    // 3936446392 order5520
    // ['spotOrderInfo', { order_id: '3936446392', pair: 'BTC-USDT' }],
    //
        // //////////////////////////////FUTURE//////////////////////////////////////////////////
      //  ['futureOrderDetails', { pair: 'EOS-USD' }],
    // ['futureBalances', {}],
    // 17157
    // 17158
    // ['bulkHistoryData', { data_type: 'T_TRADE', time_start: '2020-09-10 12:00:00', time_end: '2020-09-11 00:00:00', pair: 'BTC-USDT', asset_type: 'SPOT' }],
    // ['bulkHistoryData', { data_type: 'S_DEPTH', time_start: '2020-12-10 22:00:00', time_end: '2020-12-11 00:00:00', pair: 'BTC-USD', asset_type: 'SWAP' }],
    // ['loadHistoryData', { id: 18301 }],
    // ['futurePositions', {}],
    // ['futureOrder', { pair: 'BTC-USD', asset_type: 'THIS_WEEK', client_oid: Math.round(Math.random() * 1000000), lever_rate: 5, side: 'BUY', direction: 'UP', amount: 1, type: 'LIMIT', price: 10000 }],
    // ['futureCancelOrder', { order_id: '778103238384988160', asset_type: 'THIS_WEEK', pair: 'BTC-USD', }],
    // ['futureOrderInfo', { order_id: '778103238384988160', asset_type: 'THIS_WEEK', pair: 'BTC-USD', }],
    // ['futureAssets', {}],
        // //////////////////////////////SWAP//////////////////////////////////////////////////
        // ['coinSwapAssets', {}],
        // ['coinSwapBalances', {}],
        // ['coinSwapPositions', {}],
        // ['coinSwapOrder', { pair: 'EOS-USD', amount: 1, lever_rate: 20, side: 'BUY', price: 2, direction: 'LONG', type: 'LIMIT' }],
        // ['coinSwapCancelOrder', { pair: 'EOS-USD', client_oid: '222313231' }],
        // ['coinSwapOrderInfo', { pair: 'EOS-USD', client_oid: '222313231' }],
        // ['coinSwapUnfinishOrders', { pair: 'EOS-USD' }],
        // ['coinSwapOrderDetails', { pair: 'EOS-USD' }],
        // ['coinSwapUpdateLeverate', { pair: 'EOS-USD', lever_rate: 10 }],
        // ['coinSwapFundingHistory', { pair: 'EOS-USD' }],
        // ['coinSwapMoveBalance', { coin: 'EOS', target: 'SPOT', source: 'COIN_SWAP', amount: 0.8 }],
        // ['usdtSwapAssets', {}],
        // ['usdtSwapBalances', {}],
        // ['usdtSwapPositions', {}],
        // ['usdtSwapOrder', { pair: 'EOS-USDT', amount: 1, lever_rate: 5, side: 'BUY', price: 2, direction: 'LONG', type: 'LIMIT' }],
        // ['usdtSwapCancelOrder', { pair: 'EOS-USDT', order_id: '817631371580616704' }],
        // ['usdtSwapOrderInfo', { pair: 'EOS-USDT', order_id: '817630846725988352' }],
        // ['usdtSwapUnfinishOrders', { pair: 'EOS-USDT' }],
        // ['usdtSwapOrderDetails', { pair: 'GRT-USDT' }],
        // ['usdtSwapUpdateLeverate', { pair: 'EOS-USDT', lever_rate: 10 }],
        // ['usdtSwapFundingHistory', { pair: 'EOS-USDT' }],
        // ['usdtSwapCurrentFunding', { pair: 'EOS-USDT' }],
        // ['usdtSwapLedger', { pair: 'GRT-USDT', type: 'FUNDING_RATE' }],
        ['usdtSwapMoveBalance', { coin: 'USDT', target: 'SPOT', source: 'USDT_SWAP', amount: 1 }],
  // ////////////////////////////// 综合 //////////////////////////////////////////////////
    //
      // ['assetOrder', { pair: 'BTC-USD', asset_type: 'SWAP', side: 'OPEN', direction: 'LONG', price: 10000, amount: 1, type: 'LIMIT', order_type: 'NORMAL' }],
      // ['assetOrders', { status: 'SUCCESS', assets: [{ pair: 'BTC-USD', asset_type: 'QUARTER' }] }], //,, { pair: 'BTC-USDT', asset_type: 'SPOT' }
      // ['assetPositions', { assets }],
      // ['assetBalances', { assets }],
      // ['assetAssets', { assets }],
      // ['assetOrder', spotOrderO],
      // ['assetOrderInfo', { pair: 'ETH-USDT', asset_type: 'SPOT', order_id: '6478280687898624' }],
      // ['assetCancelOrder', { asset_type: 'SPOT', pair: 'ETH-USDT', order_id: '6478280687898624' }],
];

const tasks = [
  ...newtasks.map(([fn, params]) => ({ fn, params })),
  // {
  //   fn: 'assets',
  //   params: {
  //     coin: 'BTC'
  //   }
  // },
  // {
  //   fn: 'positions',
  //   params: {
  //     pair: 'BTC-USD',
  //   }
  // },
  // {
  //   fn: 'position',
  //   params: {
  //     pair: 'BTC-USD',
  //     asset_type: 'SWAP'
  //   }
  // },
  // {
  //   fn: 'time',
  //   params: {}
  // },

  // {
  //   fn: 'coinContractPositions',
  //   params: {
  //     // coin: 'BTC'
  //   },
  //   name: '币本位资产仓位'
  // },


  // {
  //   fn: 'spotDepth',
  //   params: {
  //     pair: 'BTC-USDT',
  //     limit: 5
  //   },
  //   name: '现货深度',
  // },

  // {
  //   fn: 'spotTrades',
  //   params: {
  //     pair: 'BTC-USDT'
  //   },
  //   name: '近期成交(归集)'
  // },
  // {
  //   fn: 'spotAggTrades',
  //   params: {
  //     pair: 'BTC-USDT'
  //   },
  //   name: '近期成交(归集)'
  // },
  // {
  //   fn: 'pairs',
  //   params: {},
  //   name: '交易对信息'
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
