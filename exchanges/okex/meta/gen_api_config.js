
/**
 *
 */
const path = require('path');
const fs = require('fs');

const RATIO = 1.1;
const config = {};
//
let timeout;
// 20次/2秒
timeout = Math.floor(2000 / 20 * RATIO);
config.order = { timeout, retry: 0 };
config.futureOrder = { timeout, retry: 0 };
config.cancelOrder = { timeout, retry: 3 };
// 10次/2秒
timeout = Math.floor(2000 / 10 * RATIO);
config.futureBalances = { timeout, retry: 3 };
config.futurePosition = { timeout, retry: 3 };
config.unfinishedOrderInfo = { timeout, retry: 3 };

// 6次2秒
timeout = Math.floor(2000 / 6 * RATIO);// 333ms 6次/2秒
config.balances = { timeout, retry: 3 };
config.unfinishedFutureOrderInfo = { timeout, retry: 3 };

// 4次2秒
timeout = Math.floor(2000 / 4 * RATIO);
config.cancelFutureOrder = { timeout, retry: 3 };

const pth = path.join(__dirname, './api.json');
fs.writeFileSync(pth, JSON.stringify(config, null, 2), 'utf8');
