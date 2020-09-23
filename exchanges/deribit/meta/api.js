
const Utils = require('./../utils');

const config = {
  positions: {
    name_cn: '全部仓位',
    endpoint: 'private/get_positions',
    notNull: ['pair']
  },
  position: {
    name_cn: '单独仓位',
    endpoint: 'private/get_position',
    notNull: ['pair', 'asset_type']
  },
  assetOrder: {
    name_cn: '下单',
    endpoint: 'private/{vector_string}',
    notNull: ['pair', 'asset_type', 'amount', 'side'],
    endpointParams: ['vector_string'],
    delEndParams: true
  },
  cancelAssetOrder: {
    name_cn: '下单',
    endpoint: 'private/cancel',
    notNull: ['order_id'],
    endpointParams: ['vector_string'],
    delEndParams: true
  },
  // 市场信息
  assets: {
    name_cn: '全部品种',
    endpoint: 'public/get_instruments',
    notNull: ['coin']
  },
  volatilityHistory: {
    name_cn: '历史波动率',
    endpoint: 'public/get_historical_volatility',
    notNull: ['coin']
  },
  // 订阅信息
  wsAssetDepth: {
    type: 'ws',
    name_cn: '深度推送',
    endpoint: 'public/subscribe',
    notNull: ['pair', 'asset_type']
  },
  wsFutureIndex: {
    type: 'ws',
    name_cn: '指数',
    endpoint: 'public/subscribe',
    notNull: ['pair']
  },
  wsOptionMarkPrice: {
    type: 'ws',
    name_cn: '期权标记价格',
    endpoint: 'public/subscribe',
    notNull: ['pair']
  },
  wsTrades: {
    type: 'ws',
    name_cn: '资产市场交易',
    endpoint: 'public/subscribe',
    notNull: ['pair', 'asset_type']
  },
  wsCoinTrades: {
    type: 'ws',
    name_cn: '某个币对的所有交易',
    endpoint: 'public/subscribe',
    notNull: ['coin', 'instrument']
  },
  //
  // wsAssetTrade: {
  //   type: 'ws',
  //   name_cn: '订单订阅',
  //   endpoint: 'private/subscribe',
  //   notNull: ['pair', 'asset_type']
  // },
  wsAssetAnyChange: {
    type: 'ws',
    name_cn: '订阅持仓下单等任意变化',
    endpoint: 'private/subscribe',
    notNull: ['pair', 'asset_type'],
    sign: true
  },
  wsAssetOrder: {
    type: 'ws',
    name_cn: '订阅下单变化',
    endpoint: 'private/subscribe',
    notNull: ['pair', 'asset_type'],
    sign: true
  },
  wsPortfolio: {
    type: 'ws',
    name_cn: '币种全仓位监控',
    endpoint: 'private/subscribe',
    notNull: ['coin'],
    sign: true
  },
  wsAssetPosition: {
    type: 'ws',
    name_cn: '仓位监控',
    endpoint: 'private/subscribe',
    notNull: ['pair', 'asset_type'],
    sign: true
  }
};

function fix(config) {
  for (const name in config) {
    const l = config[name];
    l.name = name;
    if (!l.method) l.method = 'GET';
  }
  return config;
}
module.exports = fix(config);
