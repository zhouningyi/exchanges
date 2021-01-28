
const Utils = require('./../utils');

const spotConfig = {
  // // // // // // // 公共部分  // // // // // // //
  bulkHistoryData: {
    method: 'POST',
    name_cn: '现货K线数据',
    sign: true,
    endpoint: 'sapi/v1/futuresHistDataId',
    notNull: ['time_start', 'time_end', 'data_type', 'asset_type', 'pair'],
  },
  loadHistoryData: {
    method: 'GET',
    name_cn: '下载k线数据',
    sign: true,
    endpoint: 'sapi/v1/downloadLink',
    notNull: ['id'],
  },
  spotKline: {
    method: 'GET',
    name_cn: '现货K线数据',
    endpoint: 'api/v3/klines',
  },
  spotAssets: {
    method: 'GET',
    name_cn: '所有资产',
    endpoint: 'api/v3/exchangeInfo'
  },
  // / 私有部分
  spotBalances: {
    method: 'GET',
    sign: true,
    name_cn: '现货账户余额',
    endpoint: 'api/v3/account',
  },
  spotOrder: {
    method: 'POST',
    name_cn: '现货下单',
    endpoint: 'api/v3/order',
    notNull: ['pair', 'side', 'amount'],
    sign: true
  },
  spotCancelOrder: {
    method: 'DELETE',
    name_cn: '现货撤销下单',
    endpoint: 'api/v3/order',
    notNull: ['pair'],
    sign: true
  },
  spotOrderInfo: {
    name_cn: '现货订单信息',
    endpoint: 'api/v3/order',
    notNull: ['pair'],
    sign: true
  },
  spotOrders: {
    name_cn: '现货历史订单',
    endpoint: 'api/v3/allOrders',
    sign: true,
  },
  spotUnfinishOrders: {
    name_cn: '现货未完成订单',
    endpoint: 'api/v3/openOrders',
    notNull: ['pair'],
    method: 'GET',
    sign: true
  },
  spotOrderDetails: {
    name_cn: '撮合记录',
    endpoint: 'api/v3/myTrades',
    notNull: ['pair'],
    sign: true
  },
  spotMoveBalance: {
    method: 'POST',
    name_cn: '移动资金',
    endpoint: 'sapi/v1/futures/transfer',
    notNull: ['coin', 'source', 'target', 'amount'],
    sign: true,
    check: 'moveBalance'
  },
  spotListenKey: {
    name_cn: '现货_listenKey',
    endpoint: 'api/v3/userDataStream',
    method: 'POST',
    sign: false
  },
  updateSpotListenKey: {
    name_cn: '更新现货_listenKey',
    endpoint: 'api/v3/userDataStream',
    method: 'PUT',
    sign: false
  },
  spotSystemStatus: {
    name_cn: '是否维护',
    endpoint: 'wapi/v3/systemStatus.html',
    method: 'GET',
  },
  //
  ping: {
    method: 'GET',
    name_cn: 'ping',
    endpoint: 'api/v3/ping'
  },
  time: {
    name_cn: '服务器时间',
    endpoint: 'api/v3/time'
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
  spotInterest: {
    name_cn: '杠杆利率',
    endpoint: 'sapi/v1/margin/account',
    sign: true
  },
};

// usdtContract
const usdtContractConfig = {
  usdtContractAssets: {
    name_cn: 'usdt本位合约交易对',
    endpoint: 'fapi/v1/exchangeInfo'
  },
  usdtContractKline: {
    method: 'GET',
    name_cn: 'USDT合约K线数据',
    endpoint: 'fapi/v1/continuousKlines',
    notNull: ['pair', 'interval'],
  },
  //
  usdtContractBalances: {
    method: 'GET',
    name_cn: 'USDT合约K线资产',
    endpoint: 'fapi/v2/balance',
    notNull: [],
    sign: true
  },
  usdtContractPositions: {
    name_cn: 'USDT合约持仓',
    endpoint: 'fapi/v2/positionRisk',
    sign: true
  },
  usdtContractOrders: {
    name_cn: 'USDT合约交易记录',
    endpoint: 'fapi/v1/allOrders',
    notNull: ['pair', 'asset_type'],
    sign: true
  },
  usdtContractOrder: {
    name_cn: 'USDT合约下单',
    endpoint: 'fapi/v1/order',
    notNull: ['pair', 'asset_type', 'side', 'direction', 'amount'],
    method: 'POST',
    sign: true
  },
  usdtContractCancelOrder: {
    name_cn: '撤销USDT合约下单',
    endpoint: 'fapi/v1/order',
    notNull: ['pair', 'asset_type'],
    method: 'DELETE',
    sign: true
  },
  usdtContractOrderInfo: {
    name_cn: 'USDT合约订单详情',
    endpoint: 'fapi/v1/order',
    notNull: ['pair', 'asset_type'],
    method: 'GET',
    sign: true
  },
  usdtContractUnfinishOrders: {
    name_cn: 'USDT合约未完成订单',
    endpoint: 'fapi/v1/openOrders',
    notNull: ['pair', 'asset_type'],
    method: 'GET',
    sign: true
  },
  usdtContractOrderDetails: {
    name_cn: 'USDT合约历史订单',
    endpoint: 'fapi/v1/userTrades',
    notNull: ['pair', 'asset_type'],
    method: 'GET',
    sign: true
  },
  usdtContractLedgers: {
    name_cn: 'USDT合约 交割记录',
    endpoint: 'fapi/v1/income',
    method: 'GET',
    sign: true
  },
  usdtContractListenKey: {
    name_cn: 'USDT合约_listenKey',
    endpoint: 'fapi/v1/listenKey',
    method: 'POST',
    sign: false
  },
  updateUsdtContractListenKey: {
    name_cn: 'USDT合约_listenKey',
    endpoint: 'fapi/v1/listenKey',
    method: 'PUT',
    sign: false
  },
  usdtContractUpdateLeverate: {
    name_cn: 'USDT合约 调整杠杆',
    endpoint: 'fapi/v1/leverage',
    notNull: ['pair', 'asset_type', 'lever_rate'],
    method: 'POST',
    sign: true
  }
};
const coinContractConfig = {
  coinContractBalances: {
    name_cn: '全部币本位合约账户余额',
    endpoint: 'dapi/v1/account',
    sign: true
  },
  coinContractAssets: {
    name_cn: '全部币本位合约品种信息',
    endpoint: 'dapi/v1/exchangeInfo',
    sign: true
  },
  coinContractPositionsBase: {
    name_cn: '全部币本位合约账户仓位',
    endpoint: 'dapi/v1/account',
    sign: true
  },
  coinContractPositions: {
    name_cn: '全部币本位合约持仓(风险)',
    endpoint: 'dapi/v1/positionRisk',
    sign: true
  },
  coinContractOrders: {
    name_cn: '币本位合约交易记录',
    endpoint: 'dapi/v1/allOrders',
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
  coinContractUnfinishOrders: {
    name_cn: '币本位合约未完成订单',
    endpoint: 'dapi/v1/openOrders',
    notNull: ['pair', 'asset_type'],
    method: 'GET',
    sign: true
  },
  coinContractOrderDetails: {
    name_cn: '币本位合约历史订单',
    endpoint: 'dapi/v1/userTrades',
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
  coinContractLedgers: {
    name_cn: '币本位合约 交割记录',
    endpoint: 'dapi/v1/income',
    method: 'GET',
    sign: true
  },
  coinContractUpdateLeverate: {
    name_cn: '币本位合约 调整杠杆',
    endpoint: 'dapi/v1/leverage',
    notNull: ['pair', 'asset_type', 'lever_rate'],
    method: 'POST',
    sign: true
  }
};

function fix(config, host) {
  for (const name in config) {
    const l = config[name];
    l.name = name;
    if (!l.host)l.host = host;
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
