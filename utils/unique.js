
const md5 = require('md5');


function second(t) {
  return Math.floor(t.getTime() / 1000);
}

function kline(o) {
  const tstr = o.time.getTime();
  const unique_id = md5(`${o.pair}_${tstr}_${o.interval}`);
  return { ...o, unique_id };
}
function tick(o) {
  const unique_id = md5(`${o.pair}_${second(o.time)}`);
  return { ...o, unique_id };
}

module.exports = {
  kline,
  tick
};
