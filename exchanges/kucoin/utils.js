const _ = require('lodash');

const {floor} = Math;
function formatTime(o){
  return {
    ...o,
    from: o.from ? floor(o.from / 1000) : null,
    to: o.to ? floor(o.to / 1000) : null,
  };
}

function getFilteredBalances(ds){
  ds = _.filter(ds, d => d.balance !== 0);
  return _.map(ds, d => {
    return {
      balanceStr: d.balanceStr,
      balance: d.balance,
      freezeBalanceStr: d.freezeBalanceStr,
      coin: d.coinType,
      freezeBalance: d.freezeBalance
    };
  });
}


module.exports = {
  formatTime, getFilteredBalances
};
