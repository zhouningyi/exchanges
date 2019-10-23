
const Utils = require('./../utils');

module.exports = {
  pairs: {
    name: 'pairs',
    name_cn: '币对信息',
    sign: false,
    endpoint: '0/public/AssetPairs',
  },
  spotKline: {
    method: 'GET',
    name: 'spotKline',
    name_cn: '现货K线图',
    endpoint: '0/public/OHLC',
    notNull: ['pair'],
  },
};
