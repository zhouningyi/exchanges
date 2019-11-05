const WSBase = require('../../wsBase');
const _ = require('lodash')

class WS extends WSBase {
  send(msg) {
    if (!msg) return;
    const { event } = msg;
    if (!this.isReady()) setTimeout(() => this.send(msg), 100);
    // console.log(msg, 'msg');
    const { sendSequence } = this;
    const args = (sendSequence[event] || []).concat(msg);
    _.set(sendSequence, event, args);
    setTimeout(this._send.bind(this), 100);
  }

  _send() {
    const { sendSequence } = this;
    if (!_.values(sendSequence).length) return;
    _.forEach(sendSequence, (args) => {
      _.map(args, arg => {
        this.ws.send(JSON.stringify(arg));
      })
    });
    this.sendSequence = {};
  }

  genCallback(validate, cb) {
    const validateF = typeof validate === 'function' ? validate : d => d[2] === validate;
    return (ds) => {
      if (validateF && validateF(ds)) return cb(ds);
      return false;
    };
  }
}

module.exports = WS;