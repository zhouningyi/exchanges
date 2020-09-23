
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
  }
};


function fix(config, host) {
  for (const name in config) {
    const l = config[name];
    l.name = name;
    l.host = host;
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
