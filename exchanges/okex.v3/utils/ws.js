

const _ = require('lodash');
const _ws = require('./_ws');
const { symbol2pair } = require('./public');
const { checkKey } = require('./../../../utils');

function _parse(v) {
  return parseFloat(v, 10);
}

function _getChannelStringObject(channel) {
  return { event: 'addChannel', channel };
}

function _pair2symbol(pair, isReverse = false) {
  if (!isReverse) return pair.replace('-', '_').toLowerCase();
  return pair.split('-').reverse().join('_').toLowerCase();
}


// 期货指数
const futureIndex = {
  channel: (o = {}) => {
    const { pairs } = o;
    return _.map(pairs, (p) => {
      const coin = p.replace('-USDT', '').replace('-USD', '').toLowerCase();
      const channel = `ok_sub_futureusd_${coin}_index`;
      return _getChannelStringObject(channel);
    });
  },
  validate: (res) => {
    const channel = _.get(res, '0.channel');
    return channel && channel.startsWith('ok_sub_futureusd_') && channel.endsWith('_index');
  },
  formater: (res) => {
    return _.map(res, (line) => {
      const { data: d, channel } = line;
      if (channel) {
        const coin = channel.replace('ok_sub_futureusd_', '').replace('_index', '').toUpperCase();
        const pair = `${coin.toUpperCase()}-USD`;
        return {
          pair,
          time: new Date(_parse(d.timestamp)),
          price: _parse(d.futureIndex),
          usd_cny_rate: _parse(d.usdCnyRate)
        };
      }
      return null;
    }).filter(d => d);
  }
};


// 现货tick
const ticks = {
  channel: (o = {}) => { // ok_sub_spot_bch_btc_ticker
    const { pairs } = o;
    return _.map(pairs, (p) => {
      const symbol = _pair2symbol(p);
      const channel = `ok_sub_spot_${symbol}_ticker`;
      return _getChannelStringObject(channel);
    });
  },
  validate: (res) => {
    const channel = _.get(res, '0.channel');
    return channel && channel.startsWith('ok_sub_spot_') && channel.endsWith('_ticker');
  },
  formater: (res) => {
    return _.map(res, (line) => {
      const { data: d, channel } = line;
      if (channel) { // ok_sub_spot_eos_btc_ticker
        const pair = channel.replace('ok_sub_spot_', '').replace('_ticker', '').replace('_', '-').toUpperCase();
        const bid_price = _parse(d.buy);
        const ask_price = _parse(d.sell);
        const volume_24 = _parse(d.vol);
        const change = _parse(d.change);
        const last_price = _parse(d.last);
        if (!bid_price || !ask_price) return null;
        return {
          pair,
          bid_price,
          ask_price,
          time: new Date(_parse(d.timestamp)),
          volume_24,
          change,
          last_price
        };
      }
      return null;
    }).filter(d => d);
  }
};


// 期货tick
function _parseFutureTickChanel(channel) {
  const ds = channel.replace('ok_sub_future', '').split('_ticker_');
  return {
    pair: (ds[0].split('_').reverse().join('-')).toUpperCase(),
    contract_type: ds[1]
  };
}

const futureTicks = {
  channel: (o = {}) => { // ok_sub_futureusd_X_ticker_Y
    checkKey(o, ['contract_type']);
    const { contract_type, pairs, size } = o;
    const res = [];
    _.forEach(pairs, (pair) => {
      const coin = pair.split('-')[0].toLowerCase();
      if (Array.isArray(contract_type)) {
        _.forEach(contract_type, (c) => {
          const channel = `ok_sub_futureusd_${coin}_ticker_${c}`;
          const l = _getChannelStringObject(channel);
          res.push(l);
        });
      } else {
        const channel = `ok_sub_futureusd_${coin}_ticker_${contract_type}`;
        const l = _getChannelStringObject(channel);
        res.push(l);
      }
    });
    return res;
  },
  validate: (res) => {
    const channel = _.get(res, '0.channel');
    return channel && channel.startsWith('ok_sub_futureusd_') && channel.indexOf('_ticker_') !== -1;
  },
  formater: (res) => {
    const channel = _.get(res, '0.channel');
    const { pair, contract_type } = _parseFutureTickChanel(channel);
    return _.map(res, (line) => {
      const d = line.data;
      return {
        time: new Date(),
        limit_low: _parse(d.limitLow),
        limit_high: _parse(d.limitHigh),
        high: _parse(d.high),
        low: _parse(d.low),
        pair,
        contract_type,
        bid_price: _parse(d.buy),
        ask_price: _parse(d.sell),
        last_price: _parse(d.last),
        hold_amount: _parse(d.hold_amount),
      };
    });
  }
};


const d7 = 7 * 24 * 3600 * 1000;
const d14 = d7 * 2;
function getContractType(contract_id) {
  if (!contract_id) return null;
  contract_id = `${contract_id}`;
  const year = contract_id.substring(0, 4);
  const month = contract_id.substring(4, 6);
  const day = contract_id.substring(6, 8);
  const tstr = `${year}-${month}-${day}`;
  const dt = new Date(tstr) - new Date();
  if (dt > d14) return 'quarter';
  if (dt > d7) return 'next_week';
  return 'this_week';
}

// future Position
const futurePosition = {
  channel: () => _getChannelStringObject('ok_sub_futureusd_positions'),
  validate: res => _.get(res, '0.channel') === 'ok_sub_futureusd_positions',
  formater: (res) => {
    const ds = _.map(res, (d) => {
      d = d.data;
      const { positions, symbol } = d;
      const pair = symbol.replace('_usd', '-USD').toUpperCase();
      const buy = _.filter(positions, p => p.position === 1)[0];
      const sell = _.filter(positions, p => p.position === 2)[0];
      const { contract_id } = sell;
      const contract_type = getContractType(contract_id);
      return {
        unique_id: `${pair}_${contract_type}`,
        pair,
        contract_type,
        buy_avg_price: _parse(buy.avgprice),
        buy_amount: _parse(buy.hold_amount),
        //
        benifit: _parse(sell.realized),
        sell_avg_price: _parse(sell.avgprice),
        sell_amount: _parse(sell.hold_amount),
      };
    });
    return _.flatten(ds);
  }
};


const futureBalance = {
  channel: () => _getChannelStringObject('ok_sub_futureusd_userinfo'),
  validate: res => _.get(res, '0.channel') === 'ok_sub_futureusd_userinfo',
  formater: (res) => {
    return _.map(res, (d) => {
      d = d.data;
      const coin = d.symbol.replace('_usd', '').toUpperCase();
      const line = _.pick(d, ['balance', 'profit_real', 'keep_deposit', 'account_rights']);
      return {
        coin,
        time: new Date(),
        ...line,
      };
    });
  }
};


const code2OrderStatus = {
  '-1': 'CANCEL',
  0: 'UNFINISH',
  1: 'PARTIAL',
  2: 'SUCCESS',
  3: 'CANCELLING'
};
const reverseTypeMap = {
  1: {
    side: 'BUY',
    direction: 'UP'
  },
  2: {
    side: 'BUY',
    direction: 'DOWN'
  },
  3: {
    side: 'SELL',
    direction: 'UP'
  },
  4: {
    side: 'SELL',
    direction: 'DOWN'
  }
};

const futureOrders = {
  // channel: () => _getChannelStringObject('ok_sub_futureusd_trades'),
  validate: res => _.get(res, '0.channel') === 'ok_sub_futureusd_trades',
  formater: (res) => {
    if (!res) return null;
    return _.map(res, ({ data: d }) => {
      const { contract_name } = d;
      const coin = contract_name.substring(0, 3);
      const pair = `${coin}-USD`;
      return {
        order_id: `${d.orderid}`,
        pair,
        lever_rate: d.lever_rate,
        contract_name,
        contract_type: d.contract_type,
        amount: d.amount,
        deal_amount: d.deal_amount,
        price: d.price,
        fee: d.fee,
        time: new Date(d.create_date),
        status: code2OrderStatus[d.status],
        ...(reverseTypeMap[d.type])
      };
    });
  }
};

const orders = {
  validate: (res) => {
    const channel = _.get(res, '0.channel');
    return channel.startsWith('ok_sub_spot_') && channel.endsWith('_order');
  },
  formater: (ds) => {
    return _.map(ds, (d) => {
      d = d.data;
      const { tradeType } = d;
      const side = tradeType.split('_')[0].toUpperCase();
      // const type = d.price ? 'LIMIT' : 'MARKET';
      return {
        order_id: d.orderId,
        side,
        // type,
        pair: symbol2pair(d.symbol),
        status: code2OrderStatus[d.status],
        amount: _parse(d.tradeAmount),
        deal_amount: _parse(d.completedTradeAmount),
        time: new Date(_parse(d.createdDate)),
        price: _parse(d.averagePrice) || _parse(d.tradeUnitPrice)
      };
    });
  }
};


//
function _parseWsFutureDepthChannel(channel) {  // usd_btc_kline_quarter_1min
  const ds = channel.replace('ok_sub_future', '').split('_depth_');
  const pair = symbol2pair((ds[0] || ''), true);
  const cs = ds[1].split('_');
  cs.pop();
  const contract_type = cs.join('_');
  const future_id = `${pair}_${contract_type}`;
  return { contract_type, pair, future_id };
}

function _formatFutureDepth(ds) {
  return _.map(ds, (d) => {
    return {
      price: _parse(d[0]),
      volume_amount: _parse(d[1]),
      volume_coin: _parse(d[2]),
      sum_volume_amount: _parse(d[4]),
      sum_volume_coin: _parse(d[3]),
    };
  });
}

const futureDepth = {
  channel: (o = {}) => {
    const defaultO = { size: 5 };
    checkKey(o, ['contract_type']);
    o = { ...defaultO, ...o };
    const { contract_type, pairs, size } = o;
    const res = [];
    _.forEach(pairs, (pair) => {
      pair = _pair2symbol(pair, true).replace('usdt', 'usd');
      if (Array.isArray(contract_type)) {
        _.forEach(contract_type, (c) => {
          const l = _getChannelStringObject(`ok_sub_future${pair}_depth_${c}_${size}`);
          res.push(l);
        });
      } else {
        const l = _getChannelStringObject(`ok_sub_future${pair}_depth_${contract_type}_${size}`);
        res.push(l);
      }
    });
    return res;
  },
  validate: (res) => {
    const channel = _.get(res, '0.channel');
    return channel.startsWith('ok_sub_future') && channel.indexOf('_depth_') !== -1;
  },
  formater: (ds) => {
    const res = {};
    _.forEach(ds, (d) => {
      const { data, channel } = d;
      if (!data || data.result) return null;
      const { bids, asks, timestamp } = data;
      const info = _parseWsFutureDepthChannel(channel);
      const line = {
        ...info,
        exchange: 'okex',
        time: new Date(timestamp),
        bids: _formatFutureDepth(bids),
        asks: _formatFutureDepth(_.reverse(asks))
      };
      res[`${info.future_id}`] = line;
    }).filter(d => d);
    return _.values(res);
  }
};


// depth
function _formatDepth(ds) {
  return _.map(ds, (d) => {
    return {
      exchange: 'okex',
      priceStr: d[0],
      price: _parse(d[0]),
      volumeStr: _parse(d[1]),
      volume: _parse(d[1])
    };
  });
}
function _parseWsDepthChannel(channel) {  // usd_btc_kline_quarter_1min
  const ds = channel.replace('ok_sub_spot_', '').split('_depth');
  const pair = symbol2pair(ds[0], false);
  return { pair };
}
const depth = {
  channel: (o = {}) => {
    const defaultO = { size: 5 };
    o = { ...defaultO, ...o };
    const { pairs } = o;
    return _.map(pairs, (pair) => {
      const symbol = _pair2symbol(pair, false);
      const channel = `ok_sub_spot_${symbol}_depth_${o.size}`;
      return _getChannelStringObject(channel);
    });
  },
  validate: (res) => {
    const channel = _.get(res, '0.channel');
    return channel.startsWith('ok_sub_spot_') && channel.indexOf('_depth_') !== -1;
  },
  formater: (ds) => {
    const res = {};
    _.forEach(ds, (d) => {
      const { channel, data } = d;
      const { bids, asks, timestamp, result } = data;
      if (result) return null;
      const info = _parseWsDepthChannel(channel);
      const line = {
        ...info,
        exchange: 'okex',
        time: new Date(timestamp),
        bids: _formatDepth(bids),
        asks: _formatDepth(_.reverse(asks)),
      };
      res[info.symbol] = line;
    });
    return _.values(res);
  }
};

const balance = {
  validate: (res) => {
    const channel = _.get(res, '0.channel');
    return channel.startsWith('ok_sub_spot_') && channel.endsWith('_balance');
  },
  formater: (ds) => {
    if (!ds) return null;
    const funds = _.get(ds, '0.data.info.funds') || _.get(ds, '0.data.info');
    if (!funds) return;
    const { freezed, free } = funds;
    const res = {};
    _.forEach(free, (balance, k) => {
      const locked_balance = _parse(freezed[k]);
      balance = _parse(balance);
      const coin = k.toUpperCase();
      const total_balance = locked_balance + balance;
      const line = { coin, locked_balance, balance, total_balance };
      res[coin] = line;
    });
    return _.values(res);
  }
};

const reqBalance = {
  channel: () => _getChannelStringObject('ok_spot_userinfo'),
  validate: (res) => {
    const channel = _.get(res, '0.channel');
    return channel === 'ok_spot_userinfo';
  },
  formater: (ds) => {
  }
};

const reqOrders = {
  channel: (o = {}) => {
    const { pairs } = o;
    return _.map(pairs, (pair) => {
      const symbol = pair.replace('-USDT', 'usd').replace('-USD', 'usd').toLowerCase();
      return _getChannelStringObject(`ok_${symbol}_trades`);
    });
  },
  validate: (res) => {
    const channel = _.get(res, '0.channel');
    return channel.startsWith('ok_') && channel.endsWith('_trades');
  },
  formater: (ds) => {
    // console.log(ds);
    return ds;
  }

};


module.exports = {
  ..._ws,
  // spot
  ticks,
  orders,
  reqOrders,
  depth,
  balance,
  reqBalance,
  // future
  futureIndex,
  futureTicks,
  futureOrders,
  futureBalance,
  futureDepth,
  futurePosition,
};
