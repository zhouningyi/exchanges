
const Utils = require('./../utils');


const spotConfig = {
  // // // // // // // 公共部分  // // // // // // //
  ping: {
    method: 'GET',
    name_cn: 'ping',
    endpoint: 'api/v3/ping'
  },
  time: {
    name_cn: '服务器时间',
    endpoint: 'api/v3/time'
  },
  spotPairs: {
    name_cn: '现货币对信息',
    endpoint: 'api/v3/exchangeInfo'
  },
  spotDepth: {
    name_cn: '现货深度',
    endpoint: 'api/v3/depth',
    notNull: ['pair'],
    accept: ['limit'],
  },
  spotAggTrades: {
    name_cn: '近期成交(归集)',
    endpoint: 'api/v3/aggTrades',
    notNull: ['pair'],
    accept: ['limit', 'time_start', 'time_end'],
  },
  spotTrades: {
    name_cn: '现货深度',
    endpoint: 'api/v3/historicalTrades',
    notNull: ['pair'],
    accept: ['limit', 'fromId'],
  },
  spotTicks: {
    name_cn: '现货ticker',
    endpoint: 'api/v3/ticker/bookTicker',
    notNull: ['pair'],
  },
};

const usdtContractConfig = {
  usdtContractPairs: {
    name_cn: 'usdt本位合约交易对',
    endpoint: 'fapi/v1/exchangeInfo'
  },
};

const coinContractConfig = {
  coinContractBalances: {
    name_cn: '全部币本位合约账户余额',
    endpoint: 'dapi/v1/balance',
    sign: true
  },
  coinContractPositions: {
    name_cn: '全部币本位合约账户仓位',
    endpoint: 'dapi/v1/account',
    sign: true
  },
  coinContractPositionsRisk: {
    name_cn: '全部币本位合约持仓风险',
    endpoint: 'dapi/v1/positionRisk',
    sign: true
  },
  coinContractOrders: {
    name_cn: '币本位合约交易记录',
    endpoint: 'dapi/v1/userTrades',
    notNull: ['pair', 'asset_type'],
    sign: true
  },
  coinContractOrder: {
    name_cn: '币本位合约下单',
    endpoint: 'dapi/v1/order',
    notNull: ['pair', 'asset_type', 'side', 'direction', 'amount'],
    method: 'POST',
    sign: true
  },
  coinContractBatchCancelOrder: {
    name_cn: '批量撤销币本位合约下单',
    endpoint: 'dapi/v1/batchOrders',
    notNull: ['pair', 'asset_type'],
    method: 'DELETE',
    sign: true
  },
  coinContractCancelOrder: {
    name_cn: '撤销币本位合约下单',
    endpoint: 'dapi/v1/order',
    notNull: ['pair', 'asset_type'],
    method: 'DELETE',
    sign: true
  },
  coinContractOrderInfo: {
    name_cn: '币本位合约订单',
    endpoint: 'dapi/v1/order',
    notNull: ['pair', 'asset_type'],
    method: 'GET',
    sign: true
  },
  coinContracUnfinishedtOrders: {
    name_cn: '币本位合约未完成订单',
    endpoint: 'dapi/v1/openOrders',
    notNull: ['pair', 'asset_type'],
    method: 'GET',
    sign: true
  },
  coinContractUnfinishedOrderHistory: {
    name_cn: '币本位合约历史订单',
    endpoint: 'dapi/v1/allOrders',
    notNull: ['pair', 'asset_type'],
    method: 'GET',
    sign: true
  },
  coinContractListenKey: {
    name_cn: '币本位合约_listenKey',
    endpoint: 'dapi/v1/listenKey',
    method: 'POST',
    sign: false
  },
  updateCoinContractListenKey: {
    name_cn: '币本位合约_listenKey',
    endpoint: 'dapi/v1/listenKey',
    method: 'PUT',
    sign: false
  },
};

function fix(config, host) {
  for (const name in config) {
    const l = config[name];
    l.name = name;
    l.host = host;
    if (!l.sign)l.sign = false;
    if (!l.method) l.method = 'GET';
  }
  return config;
}

const config = {
  ...fix(spotConfig, 'spot'),
  ...fix(usdtContractConfig, 'usdt_contract'),
  ...fix(coinContractConfig, 'coin_contract'),
};


module.exports = config;
