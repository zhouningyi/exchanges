
const morph = require('./morph');
const Console = require('./console');

// function filterByList(o, list){
//   const result = {};
//   _.forEach();
// }

module.exports = {
  ...morph, ...Console
};
