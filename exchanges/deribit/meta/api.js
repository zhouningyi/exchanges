
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
  coinBalance: {
    name_cn: '账户资产(币为单位)',
    endpoint: 'private/get_account_summary',
    notNull: ['coin']
  },
  assetOrder: {
    name_cn: '下单',
    endpoint: 'private/{vector_string}',
    notNull: ['instrument_id', 'amount', 'side'],
    endpointParams: ['vector_string'],
    delEndParams: true
  },
  assetOrderInfo: {
    name_cn: '订单',
    endpoint: 'private/get_order_state',
    notNull: ['order_id']
  },
  coinAssetOrders: {
    name_cn: '币种的订单信息',
    endpoint: 'private/get_user_trades_by_currency',
    notNull: ['coin']
  },
  coinUnfinishAssetOrders: {
    name_cn: '币种的未成交订单信息',
    endpoint: 'private/get_open_orders_by_currency',
    notNull: ['coin']
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
    endpoint: 'private/subscribe',
    notNull: ['pair']
  },
  // wsInstrumentDepth: {
  //   type: 'ws',
  //   name_cn: '深度推送(按品种)',
  //   endpoint: 'public/subscribe',
  //   notNull: ['pair', 'instrument']
  // },
  wsIndex: {
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
  wsAssetTicker: {
    type: 'ws',
    name_cn: 'ticker',
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
  wsCoinAssetOrder: {
    type: 'ws',
    name_cn: '订阅下单变化',
    endpoint: 'private/subscribe',
    notNull: ['coin', 'asset_type'],
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
