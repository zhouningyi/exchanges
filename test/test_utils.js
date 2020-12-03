
const timeSpec = require('./../utils/time_spec');


// timeSpec();


const Binance = require('./../exchanges/binance');

const binance = new Binance({
    apiKey: '6hnKjWdUAvK5ADfBaA6lbJ169uPuaczkhorjnjYYNB3q6F2IfUpfOQP4n9l39wcN', 
    apiSecret: 'c02HMEBTALdqxwGqyda1SyjLie3WMibm5TsQ9EqhySYS5JnYyhsqiIAaFHevlemt'
})
const o = { timestamp : new Date().getTime(), endTime: new Date().getTime(), startTime: new Date('2020-11-01').getTime() }
binance.spotInterest(o)