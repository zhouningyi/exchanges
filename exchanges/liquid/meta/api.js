
const Utils = require('../utils');

module.exports = {
  pairs: {
    name: 'pairs',
    name_cn: '币对信息',
    sign: false,
    endpoint: 'products',
  },
  // spotKline: {
  //   method: 'GET',
  //   name: 'spotKline',
  //   name_cn: '现货K线图',
  //   endpoint: '0/public/OHLC',
  //   notNull: ['pair'],
  // },
  // depth: {
  //   method: 'GET',
  //   name: 'depth',
  //   name_cn: '深度',
  //   endpoint: 'products/:id/price_levels',
  //   notNull: ['pair'],
  // },
  // spotTicks: {
  //   name: 'spotTicks',
  //   name_cn: '现货tick',
  //   sign: false,
  //   endpoint: '0/public/Ticker'
  // },
};
