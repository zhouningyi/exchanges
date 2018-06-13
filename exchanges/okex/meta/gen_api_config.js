
/**
 *
 */
const path = require('path');
const fs = require('fs');

const RATIO = 2.1;
const timeout = 3000;
const config = {};
let rateLimit;
//
// 20次/2秒
rateLimit = Math.floor(2000 / 20 * RATIO);
config.order = { timeout, rateLimit, retry: 0 };
config.futureOrder = { timeout, rateLimit, retry: 0 };
config.cancelOrder = { timeout, rateLimit, retry: 3 };
// 10次/2秒
rateLimit = Math.floor(2000 / 10 * RATIO);
config.futureBalances = { timeout, rateLimit, retry: 3 };
config.futurePosition = { timeout, rateLimit, retry: 3 };
config.unfinishedOrderInfo = { timeout, rateLimit, retry: 3 };

// 6次2秒
rateLimit = Math.floor(2000 / 6 * RATIO);// 333ms 6次/2秒
config.balances = { timeout, rateLimit, retry: 3 };
config.unfinishedFutureOrderInfo = { timeout, rateLimit, retry: 3 };

// 4次2秒
rateLimit = Math.floor(2000 / 4 * RATIO);
config.cancelFutureOrder = { timeout, rateLimit, retry: 3 };

const pth = path.join(__dirname, './api.json');
fs.writeFileSync(pth, JSON.stringify(config, null, 2), 'utf8');
