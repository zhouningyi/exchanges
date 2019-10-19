
const Utils = require('./../utils');

module.exports = {
  spotKline: {
    method: 'GET',
    name: 'spotKline',
    name_cn: '现货K线图',
    endpoint: '0/public/OHLC',
    notNull: ['pair'],
  },
};
