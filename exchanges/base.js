// const Utils = require('./utils');
const Event = require('bcore/event');

class exchange extends Event {
  constructor({apiKey, apiSecret}) {
    super();
    this.apiSecret = apiSecret;
    this.apiKey = apiKey;
    this.proxy = 'http://127.0.0.1:1087';
  }
  async order() {
  }
  getSignature(path, queryString, nonce) {
    const strForSign = `${path}/${nonce}/${queryString}`;
    const signatureStr = new Buffer(strForSign).toString('base64');
    const signatureResult = crypto.createHmac('sha256', this._apiSecret)
      .update(signatureStr)
      .digest('hex');
    return signatureResult;
  }
}

module.exports = exchange;
