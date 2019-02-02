
const Utils = require('./../utils');

module.exports = {
  // order: {
  //   timeout: 5000,
  //   rateLimit: 110,
  //   retry: 0
  // },
  // futureOrder: {
  //   timeout: 5000,
  //   rateLimit: 110,
  //   retry: 0
  // },
  // cancelOrder: {
  //   timeout: 15000,
  //   rateLimit: 110,
  //   retry: 2
  // },
  // futureBalances: {
  //   timeout: 5000,
  //   rateLimit: 220,
  //   retry: 3
  // },
  // futurePosition: {
  //   timeout: 5000,
  //   rateLimit: 220,
  //   retry: 3
  // },
  // unfinishedOrderInfo: {
  //   timeout: 5000,
  //   rateLimit: 220,
  //   retry: 3
  // },
  // balances: {
  //   timeout: 5000,
  //   rateLimit: 366,
  //   retry: 3
  // },
  // unfinishedFutureOrderInfo: {
  //   timeout: 5000,
  //   rateLimit: 366,
  //   retry: 3
  // },
  // allFutureOrders: {
  //   timeout: 5000,
  //   rateLimit: 366,
  //   retry: 3
  // },
  // allOrders: {
  //   timeout: 5000,
  //   rateLimit: 366,
  //   retry: 3
  // },
  // cancelFutureOrder: {
  //   timeout: 15000,
  //   rateLimit: 550,
  //   retry: 2
  // },
  //
  withdrawHistory: {
    name: 'withdrawHistory',
    name_cn: '提币历史',
    endpoint: 'account/v3/withdrawal/history',
    desc: '',
    sign: true,
    notNull: [],
    formatO: Utils.formatWithDrawHistoryO,
    format: Utils.formatWithDrawHistory,
  },
  ledger: {
    name: 'ledger',
    name_cn: '流水',
    sign: true,
    endpoint: 'account/v3/ledger',
    desc: '',
    notNull: [],
    formatO: Utils.formatWalletLedgerO,
    format: Utils.formatWalletLedger,
  },
  balances: {
    name: 'balances',
    name_cn: '余额',
    sign: true,
    endpoint: 'spot/v3/accounts',
    desc: '',
    notNull: [],
    formatO: Utils.formatBalanceO,
    format: Utils.formatBalance,
  }
};
