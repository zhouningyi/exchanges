
const timeSpec = require('./../utils/time_spec');


// timeSpec();


const Binance = require('./../exchanges/binance');
const Huobi = require('./../exchanges/huobi');

const binance = new Binance({
    apiKey: '', 
    apiSecret: ''
})

const huobi = new Huobi({
    apiKey: '', 
    apiSecret: ''
})

huobi.spotInterest({symbols:'btcusdt'})