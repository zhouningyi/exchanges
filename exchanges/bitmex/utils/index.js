
const _ = require('lodash');

function pair2symbol(pair) {
  if (!pair) return false;
  return pair.split('-').map(formatCoin).join('');
}

function symbol2pair(symbol) {
  if (!pair) return false;
  return pair.split('-').map(formatCoin).join('');
}

function formatCoin(coin) {
  coin = coin.toUpperCase();
  if (coin === 'BTC') return 'XBT';
  return coin;
}

//
function formatFunding(ds) {
  return _.map(ds, (d) => {
    return {
    };
  });
}

module.exports = {
  pair2symbol,
  formatCoin
};


// const days = 90;

// function delta(benifit) {
//   const ratio = 0.001;
//   return 1 + benifit + 2 * (0.5 - Math.random()) * ratio;
// }

// let s = 1;
// for (let i = 0; i < days; i++) {
//   const benifit = 2 / 1000;
//   const benifitFinal = delta(benifit);
//   s *= benifitFinal;
// }
// console.log(s);
