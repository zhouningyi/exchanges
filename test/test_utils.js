
const timeSpec = require('./../utils/time_spec');


// timeSpec();


const Binance = require('./../exchanges/binance');
const Huobi = require('./../exchanges/huobi');

const binance = new Binance({
    apiKey: '6hnKjWdUAvK5ADfBaA6lbJ169uPuaczkhorjnjYYNB3q6F2IfUpfOQP4n9l39wcN', 
    apiSecret: 'c02HMEBTALdqxwGqyda1SyjLie3WMibm5TsQ9EqhySYS5JnYyhsqiIAaFHevlemt'
})

const huobi = new Huobi({
    apiKey: 'ur2fg6h2gf-d0d2b447-6e9bcef0-e4e0f', 
    apiSecret: 'f68132eb-8523c7f6-101a54d3-c97e8'
})

huobi.spotInterest({symbols:'btcusdt'})