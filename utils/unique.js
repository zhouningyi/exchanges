
const md5 = require('md5');

function kline(o) {
  const tstr = o.time.getTime();
  const unique_id = md5(`${o.pair}_${tstr}_${o.interval}`);
  return { ...o, unique_id };
}

module.exports = {
  kline
};
