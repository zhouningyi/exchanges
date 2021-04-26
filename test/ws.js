
const _ = require('lodash');
//
const Exchanges = require('./../index');
const config = require('./../config');
const Utils = require('./utils');


const pairs = ['btc-usdt', 'eth-usdt', 'link-usdt', 'dot-usdt', 'ada-usdt', 'ltc-usdt', 'bch-usdt', 'xrp-usdt', 'bnb-usdt', 'trx-usdt', 'hbar-usdt', 'dent-usdt', 'one-usdt', 'mana-usdt', 'lina-usdt', 'alice-usdt', 'hot-usdt', 'mtl-usdt', 'celr-usdt', 'ogn-usdt', 'stmx-usdt', 'zen-usdt', 'grt-usdt', 'bel-usdt', 'ocean-usdt', 'axs-usdt', 'skl-usdt', '1inch-usdt', 'rsr-usdt', 'zec-usdt', 'fil-usdt', 'bal-usdt', 'xmr-usdt', 'omg-usdt', 'knc-usdt', 'kava-usdt', 'uni-usdt', 'rune-usdt', 'icx-usdt', 'band-usdt', 'tomo-usdt', 'crv-usdt', 'algo-usdt', 'doge-usdt', 'atom-usdt', 'cvc-usdt', 'iota-usdt', 'ctk-usdt', 'egld-usdt', 'vet-usdt', 'ftm-usdt', 'flm-usdt', 'bzrx-usdt', 'dash-usdt', 'storj-usdt', 'snx-usdt', 'avax-usdt', 'neo-usdt', 'sxp-usdt', 'sushi-usdt', 'sol-usdt', 'aave-usdt', 'hnt-usdt', 'rlc-usdt', 'ksm-usdt', 'trb-usdt', 'srm-usdt', 'zrx-usdt', 'ren-usdt', 'enj-usdt', 'blz-usdt', 'near-usdt', 'bat-usdt', 'waves-usdt', 'iost-usdt', 'yfii-usdt', 'ont-usdt', 'qtum-usdt', 'matic-usdt', 'zil-usdt', 'alpha-usdt', 'lrc-usdt', 'yfi-usdt', 'xlm-usdt', 'theta-usdt', 'xtz-usdt', 'dodo-usdt', 'coti-usdt', 'reef-usdt', 'luna-usdt', 'chz-usdt', 'sfp-usdt', 'lit-usdt', 'ankr-usdt', 'xem-usdt', 'chr-usdt', 'sand-usdt', 'unfi-usdt', 'bts-usdt', 'akro-usdt', 'rvn-usdt'];
const all_assets = [
  ...pairs.map(pair => ({ pair: pair.toUpperCase(), exchange: 'BINANCE', asset_type: 'SWAP' })),
  ...pairs.map(pair => ({ pair: pair.toUpperCase(), exchange: 'BINANCE', asset_type: 'SPOT' }))
];

const newtasks = [
  // ['wsCoinSwapEstimateFunding', { assets: ['BTC', 'EOS', 'ETC'].map(coin => ({ pair: `${coin}-USD`, asset_type: 'SWAP', exchange: 'HUOBI' })) }],
  // ['wsUsdtSwapEstimateFunding', { assets: ['BTC', 'EOS', 'ETC'].map(coin => ({ pair: `${coin}-USDT`, asset_type: 'SWAP', exchange: 'HUOBI' })) }],
  // ['wsFutureIndex', { pair: 'BTC-USD' }],
  // ['wsOptionMarkPrice', { pair: 'BTC-USD' }],
  // ['wsAssetTrades', { pair: 'BTC-USD', asset_type: 'SWAP' }],
  // ['wsCoinTrades', { coin: 'BTC', instrument: 'future', }],
  // ['wsAssetOrder', { pair: 'BTC-USD', asset_type: 'SWAP' }],
  // ['wsPortfolio', { coin: 'BTC' }],
  // ['wsAssetPosition', { pair: 'BTC-USD', asset_type: 'SWAP' }],
  // ['wsAssetTrade', { pair: 'BTC-USD', asset_type: 'SWAP' }],
  // ['wsAssetAnyChange', { pair: 'BTC-USD', asset_type: 'SWAP' }],
  // ['wsCoinContractDepth', { pair: 'BTC-USD', asset_type: 'QUARTER', level: 10 }],
  // ['wsCoinContractOrder', { pair: 'BTC-USD', asset_type: 'QUARTER' }],
  // ['wsCoinSwapDepth', { assets: [{ pair: 'EOS-USD', asset_type: 'QUARTER' }] }],
// ['wsUsdtSwapOrders'],
// ['wsUsdtSwapBalances'],
// ['wsUsdtSwapPositions'],
  // ['wsUsdtSwapDepth', { assets: [{ pair: 'EOS-USDT' }] }],
  // ['wsCoinContractOrders', { assets: [{ pair: 'EOS-USD', asset_type: 'QUARTER' }] }],
  // ['wsCoinContractBalance', { assets: [{ pair: 'EOS-USD', asset_type: 'QUARTER' }] }],
  // ['wsCoinContractPosition', { assets: [{ pair: 'EOS-USD', asset_type: 'QUARTER' }] }],
  // ['wsFutureOrders', {}],
  // ['wsFuturePosition', {}],
  // ['wsSpotBalance', {}],
  // ['wsSpotOrders', { assets: [{ pair: 'BTC-USDT' }] }],
  // ['wsFutureDepth', { assets: [{ pair: 'BTC-USD', asset_type: 'QUARTER' }, { pair: 'BTC-USD', asset_type: 'NEXT_QUARTER' }] }],
  // ['wsSpotDepth', { assets: [{ pair: 'BTC-USDT', asset_type: 'SPOT' }] }],
  ['subscribeAssetDepth', { assets: all_assets }],
  // ['subscribeAssetOrders', { pair: ['EOS-USD', 'BTC-USD'], asset_type: ['SPOT', 'SWAP', 'next_quarter'] }],
  // ['subscribeAssetPositions', { pair: ['ETH-USD', 'BTC-USD'], asset_type: ['swap', 'next_quarter'] }],
  // ['subscribeAssetBalances', { pair: ['EOS-USD'], asset_type: ['SPOT', 'SWAP', 'next_quarter'] }],
  // ['wsSpotOrders', {}],
  // ['wsRequestCoinContractPositions', {}],
  // ['wsUsdtContractPositions', {}],
  // ['wsUsdtContractDepth', { assets: all_assets }], //[{ pair: 'BTC-USDT', asset_type: 'SWAP' }]
  // ['wsUsdtContractOrders', { assets: [{ pair: 'BTC-USDT', asset_type: 'SWAP' }] }],
  // ['wsUsdtContractBalances', { assets: [{ pair: 'BTC-USDT', asset_type: 'SWAP' }] }]
];


const wsList = [
  ...newtasks.map(([fn, params]) => ({ fn, params })),
  // {
  //   fn: 'wsAssetDepth',
  //   params: {
  //     pair: 'BTC-USD',
  //     asset_type: 'SWAP',
  //     group: 2,
  //     depth: 10
  //   },
  //   name: 'wsTicks'
  // },

  // {
  //   fn: 'wsTicks',
  //   params: {
  //     pairs: ['BTC-USD', 'BTC-EOS']
  //   },
  //   name: 'wsTicks'
  // },

  // {
  //   fn: 'wsSpotBalance',
  //   params: {
  //     pairs: ['XRP-USDT', 'EOS-USDT']
  //   },
  //   name: 'spotBalance'
  // },
  // {
  //   fn: 'wsSpotOrders',
  //   params: {
  //     pairs: ['XRP-USDT', 'EOS-USDT']
  //   },
  //   name: 'wsSpotOrders'
  // },

  // {
  //   fn: 'wsFutureTicks',
  //   params: {
  //     contract_type: ['this_week', 'quarter', 'next_week'], // 'quarter',
  //     pairs: ['BTC-USD']
  //   },
  //   name: '期货tick数据111211...'
  // },
  // {
  //   fn: 'wsSwapTicks',
  //   params: {
  //     pairs: ['BTC-USD', 'ETH-USD', 'EOS-USD']
  //   },
  //   name: '永续合约tick...'
  // },
  // {
  //   fn: 'wsSwapDepth',
  //   params: {
  //     pairs: ['BTC-USD']
  //   },
  //   name: '永续合约tick...'
  // },
  // {
  //   fn: 'wsFutureBalance',
  //   params: {
  //     coins: ['EOS', 'ETH'],
  //   },
  //   name: 'wsFutureBalance'
  // },
  // {
  //   fn: 'wsFutureIndex',
  //   params: {
  //     pairs: [
  //       'BTC-USD' // 'EOS-USD',
  //     ]
  //   },
  //   name: '合约指数'
  // },
  // {
  //   fn: 'wsFutureOrders',
  //   params: {
  //     pairs: ['BTC-USD'],
  //     contract_type: 'this_week'
  //   },
  //   name: ''
  // },
  // {
  //   fn: 'wsFuturePosition',
  //   params: {
  //     pairs: ['ETH-USD'],
  //     contract_type: ['quarter']
  //   },
  //   name: ''
  // },
  // {
  //   fn: 'wsBalance',
  //   params: {
  //     coins: ['BTC', 'EOS', 'USDT']
  //   },
  //   name: '余额数据'
  // },
  // {
  //   fn: 'wsReqBalance',
  //   params: {
  //   },
  //   name: '余额数据'
  // },


  // {
  //   fn: 'wsReqOrders',
  //   params: {
  //     pairs: ['EOS-USDT']
  //   },
  // },

  // {
  //   fn: 'wsOrders',
  //   params: {
  //     pairs: ['BTC-USDT']
  //   },
  //   name: '登录'
  // },

  // {
  //   fn: 'wsFutureKlines',
  //   params: {
  //   },
  //   name: '期货tick k线图...'
  // },
  // {
  //   fn: 'wsKline',
  //   params: {
  //     pairs: ['BTC-USD'],
  //     interval: 5
  //   },
  //   name: '现货tick k线图...(指定pair)'
  // },
  // {
  //   fn: 'wsFutureDepth',
  //   params: {
  //     contract_type: 'quarter',
  //     pairs: ['EOS-USDT']
  //   },
  //   name: '期货深度图'
  // },

  // {
  //   fn: 'wsFutureDepth',
  //   params: {
  //     contract_type: ['this_week', 'next_week', 'quarter'],
  //     pairs: ['EOS-USDT']
  //   },
  //   name: '期货深度图'
  // },

  // {
  //   fn: 'wsDepth',
  //   params: {
  //     pairs: ['BTC-USDT', 'EOS-USDT'], // 'BTC-USDT',
  //     depth: 100
  //   },
  //   name: '深度图'
  // },

  // {
  //   fn: 'wsSwapBalance',
  //   params: {
  //     pairs: ['ETH-USD', 'EOS-USD'], // 'BTC-USDT',
  //   },
  //   name: '永续账户'
  // },

  // {
  //   fn: 'wsSwapPosition',
  //   params: {
  //     pairs: ['ETH-USD', 'EOS-USD'], // 'BTC-USDT',
  //   },
  //   name: '永续账户'
  // },

  // {
  //   fn: 'wsSwapOrder',
  //   params: {
  //     pairs: ['ETH-USD', 'EOS-USD'], // 'BTC-USDT',
  //   },
  //   name: '永续订单'
  // },


  // {
  //   fn: 'wsFutureBalance',
  //   params: {
  //   },
  //   name: 'ws的余额'
  // },
];

const is_print = false;
function testOneExchangeWs(exName, list) {
  const ex = Utils.getExchange(exName);
  _.forEach(list, (o) => {
    const { fn, params } = o;
    ex[fn](params, (ds) => {
      if (is_print) console.log(ds, fn);
    });
  });
}

const exchangeName = 'binance';
// const exchangeName = 'okexV3';

console.log(`=============【${exchangeName}...】=============`);
testOneExchangeWs(exchangeName, wsList);
Utils.live();
