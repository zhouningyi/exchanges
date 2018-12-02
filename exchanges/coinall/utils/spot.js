const _ = require('lodash');
const Utils = require('./../../../utils');
const publicUtils = require('./public');

function _parse(v) {
  return parseFloat(v, 10);
}

function formatCoin(ds) {
  return _.map(ds, (d) => {
    return {
      name: d.id,
      deposit: !!d.deposit,
      withdraw: !!d.withdraw
    };
  });
}

function formatTick(ds) {
  return _.map(ds, (d) => {
    return {
      pair: d.product_id,
      exchange: 'coinall',
      ask_price: _parse(d.best_ask),
      bid_price: _parse(d.best_bid),
      last_price: _parse(d.last),
      volume_24: _parse(d.volume),
      time: new Date(d.timestamp)
    };
  });
}

function formatBalance(ds) {
  return formatWallet(ds);
}

function formatWallet(ds) {
  return _.map(ds, (d) => {
    return {
      total_balance: _parse(d.balance),
      locked_balance: _parse(d.holds),
      balance: _parse(d.available),
      coin: d.currency
    };
  });
}


// order
const orderTypeMap = {
  LIMIT: 'limit',
  MARKET: 'market'
};

const tradeTypeMap = {
  lever: 2,
  normal: 1
};

const sideMap = {
  buy: 'buy',
  sell: 'sell'
};

function formatOrderO(o = {}) {
  return {
    price: o.price,
    product_id: o.pair,
    side: sideMap[o.side.toLowerCase()],
    size: o.amount,
    type: orderTypeMap[o.type],
    system_type: tradeTypeMap[o.tradeType] || 1, // 默认为币币交易
  };
}

function formatOrder(o, opt, status) {
  publicUtils.errorDetect(o);
  const { order_id, client_oid } = o;
  const time = new Date();
  const oidtype = typeof order_id;
  if (order_id) {
    if (oidtype === 'string' || oidtype === 'number') {
      return {
        pair: opt.pair,
        order_id,
        status,
        order_main_id: client_oid,
        amount: opt.amount,
        price: opt.price,
        type: opt.type,
        time
      };
    } else if (Array.isArray(order_id)) {
      return _.map(order_id, (oid) => {
        return {
          order_id: oid,
          order_main_id: client_oid,
          status,
          time
        };
      });
    }
  }
  throw new Error('order not success...');
}

const moveBalanceMap = {
  // future: 1,
  spot: 1,
  child: 0,
  wallet: 6
};

function formatMoveBalanceO(o = {}) {
  return {
    currency: o.coin,
    amount: o.amount,
    from: moveBalanceMap[o.source],
    to: moveBalanceMap[o.target]
  };
}

function formatUnfinishOrder(ds) {
  return _.map(ds, (d) => {
    const res = {
      order_id: `${d.order_id}`,
      pair: d.product_id,
      price: _parse(d.price),
      side: d.side.toUpperCase(),
      type: d.type.toUpperCase(),
      time: new Date(d.created_at),
      amount: _parse(d.size),
      deal_amount: _parse(d.executed_value),
      status: 'UNFINISH',
    };
    return res;
  });
}

const statusMap = {
  filled: 'SUCCESS',
  part_filled: 'PARTIAL',
  open: 'UNFINISH',
  canceling: 'CANCELLING',
  canceled: 'CANCEL'
};
function formatOrderInfo(d, o) {
  publicUtils.errorDetect(d);
  const status = statusMap[d.status];
  if (!status) console.log(d.status, 'status...');
  return {
    pair: d.product_id.toUpperCase(),
    order_id: `${d.order_id}`,
    time: new Date(d.created_at),
    deal_amount: _parse(d.filled_size),
    side: d.side.toUpperCase(),
    amount: _parse(d.size),
    status,
    type: d.type.toUpperCase()
  };
}
module.exports = {
  formatCoin,
  formatTick,
  formatBalance,
  formatWallet,
  // order
  formatOrderO,
  formatOrder,
  formatMoveBalanceO,
  formatUnfinishOrder,
  formatOrderInfo
};
