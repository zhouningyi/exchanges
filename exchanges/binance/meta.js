

const pairMap = {
  ETHBTC: 'ETH-BTC',
  LTCBTC: 'LTC-BTC',
  BNBBTC: 'BNB-BTC',
  NEOBTC: 'NEO-BTC',
  QTUMETH: 'QTUM-ETH',
  EOSETH: 'EOS-ETH',
  SNTETH: 'SNT-ETH',
  BNTETH: 'BNT-ETH',
  BCCBTC: 'BCC-BTC',
  GASBTC: 'GAS-BTC',
  BNBETH: 'BNB-ETH',
  BTCUSDT: 'BTC-USDT',
  ETHUSDT: 'ETH-USDT',
  HSRBTC: 'HSR-BTC',
  OAXETH: 'OAX-ETH',
  DNTETH: 'DNT-ETH',
  MCOETH: 'MCO-ETH',
  ICNETH: 'ICN-ETH',
  MCOBTC: 'MCO-BTC',
  WTCBTC: 'WTC-BTC',
  WTCETH: 'WTC-ETH',
  LRCBTC: 'LRC-BTC',
  LRCETH: 'LRC-ETH',
  QTUMBTC: 'QTUM-BTC',
  YOYOBTC: 'YOYO-BTC',
  OMGBTC: 'OMG-BTC',
  OMGETH: 'OMG-ETH',
  ZRXBTC: 'ZRX-BTC',
  ZRXETH: 'ZRX-ETH',
  STRATBTC: 'STRAT-BTC',
  STRATETH: 'STRAT-ETH',
  SNGLSBTC: 'SNGLS-BTC',
  SNGLSETH: 'SNGLS-ETH',
  BQXBTC: 'BQX-BTC',
  BQXETH: 'BQX-ETH',
  KNCBTC: 'KNC-BTC',
  KNCETH: 'KNC-ETH',
  FUNBTC: 'FUN-BTC',
  FUNETH: 'FUN-ETH',
  SNMBTC: 'SNM-BTC',
  SNMETH: 'SNM-ETH',
  NEOETH: 'NEO-ETH',
  IOTABTC: 'IOTA-BTC',
  IOTAETH: 'IOTA-ETH',
  LINKBTC: 'LINK-BTC',
  LINKETH: 'LINK-ETH',
  XVGBTC: 'XVG-BTC',
  XVGETH: 'XVG-ETH',
  CTRBTC: 'CTR-BTC',
  CTRETH: 'CTR-ETH',
  SALTBTC: 'SALT-BTC',
  SALTETH: 'SALT-ETH',
  MDABTC: 'MDA-BTC',
  MDAETH: 'MDA-ETH',
  MTLBTC: 'MTL-BTC',
  MTLETH: 'MTL-ETH',
  SUBBTC: 'SUB-BTC',
  SUBETH: 'SUB-ETH',
  EOSBTC: 'EOS-BTC',
  SNTBTC: 'SNT-BTC',
  ETCETH: 'ETC-ETH',
  ETCBTC: 'ETC-BTC',
  MTHBTC: 'MTH-BTC',
  MTHETH: 'MTH-ETH',
  ENGBTC: 'ENG-BTC',
  ENGETH: 'ENG-ETH',
  DNTBTC: 'DNT-BTC',
  ZECBTC: 'ZEC-BTC',
  ZECETH: 'ZEC-ETH',
  BNTBTC: 'BNT-BTC',
  ASTBTC: 'AST-BTC',
  ASTETH: 'AST-ETH',
  DASHBTC: 'DASH-BTC',
  DASHETH: 'DASH-ETH',
  OAXBTC: 'OAX-BTC',
  ICNBTC: 'ICN-BTC',
  BTGBTC: 'BTG-BTC',
  BTGETH: 'BTG-ETH',
  EVXBTC: 'EVX-BTC',
  EVXETH: 'EVX-ETH',
  REQBTC: 'REQ-BTC',
  REQETH: 'REQ-ETH',
  VIBBTC: 'VIB-BTC',
  VIBETH: 'VIB-ETH',
  HSRETH: 'HSR-ETH',
  TRXBTC: 'TRX-BTC',
  TRXETH: 'TRX-ETH',
  POWRBTC: 'POWR-BTC',
  POWRETH: 'POWR-ETH',
  ARKBTC: 'ARK-BTC',
  ARKETH: 'ARK-ETH',
  YOYOETH: 'YOYO-ETH',
  XRPBTC: 'XRP-BTC',
  XRPETH: 'XRP-ETH',
  MODBTC: 'MOD-BTC',
  MODETH: 'MOD-ETH',
  ENJBTC: 'ENJ-BTC',
  ENJETH: 'ENJ-ETH',
  STORJBTC: 'STORJ-BTC',
  STORJETH: 'STORJ-ETH',
  BNBUSDT: 'BNB-USDT',
  VENBNB: 'VEN-BNB',
  YOYOBNB: 'YOYO-BNB',
  POWRBNB: 'POWR-BNB',
  VENBTC: 'VEN-BTC',
  VENETH: 'VEN-ETH',
  KMDBTC: 'KMD-BTC',
  KMDETH: 'KMD-ETH',
  NULSBNB: 'NULS-BNB',
  RCNBTC: 'RCN-BTC',
  RCNETH: 'RCN-ETH',
  RCNBNB: 'RCN-BNB',
  NULSBTC: 'NULS-BTC',
  NULSETH: 'NULS-ETH',
  RDNBTC: 'RDN-BTC',
  RDNETH: 'RDN-ETH',
  RDNBNB: 'RDN-BNB',
  XMRBTC: 'XMR-BTC',
  XMRETH: 'XMR-ETH',
  DLTBNB: 'DLT-BNB',
  WTCBNB: 'WTC-BNB',
  DLTBTC: 'DLT-BTC',
  DLTETH: 'DLT-ETH',
  AMBBTC: 'AMB-BTC',
  AMBETH: 'AMB-ETH',
  AMBBNB: 'AMB-BNB',
  BCCETH: 'BCC-ETH',
  BCCUSDT: 'BCC-USDT',
  BCCBNB: 'BCC-BNB',
  BATBTC: 'BAT-BTC',
  BATETH: 'BAT-ETH',
  BATBNB: 'BAT-BNB',
  BCPTBTC: 'BCPT-BTC',
  BCPTETH: 'BCPT-ETH',
  BCPTBNB: 'BCPT-BNB',
  ARNBTC: 'ARN-BTC',
  ARNETH: 'ARN-ETH',
  GVTBTC: 'GVT-BTC',
  GVTETH: 'GVT-ETH',
  CDTBTC: 'CDT-BTC',
  CDTETH: 'CDT-ETH',
  GXSBTC: 'GXS-BTC',
  GXSETH: 'GXS-ETH',
  NEOUSDT: 'NEO-USDT',
  NEOBNB: 'NEO-BNB',
  POEBTC: 'POE-BTC',
  POEETH: 'POE-ETH',
  QSPBTC: 'QSP-BTC',
  QSPETH: 'QSP-ETH',
  QSPBNB: 'QSP-BNB',
  BTSBTC: 'BTS-BTC',
  BTSETH: 'BTS-ETH',
  BTSBNB: 'BTS-BNB',
  XZCBTC: 'XZC-BTC',
  XZCETH: 'XZC-ETH',
  XZCBNB: 'XZC-BNB',
  LSKBTC: 'LSK-BTC',
  LSKETH: 'LSK-ETH',
  LSKBNB: 'LSK-BNB',
  TNTBTC: 'TNT-BTC',
  TNTETH: 'TNT-ETH',
  FUELBTC: 'FUEL-BTC',
  FUELETH: 'FUEL-ETH',
  MANABTC: 'MANA-BTC',
  MANAETH: 'MANA-ETH',
  BCDBTC: 'BCD-BTC',
  BCDETH: 'BCD-ETH',
  DGDBTC: 'DGD-BTC',
  DGDETH: 'DGD-ETH',
  IOTABNB: 'IOTA-BNB',
  ADXBTC: 'ADX-BTC',
  ADXETH: 'ADX-ETH',
  ADXBNB: 'ADX-BNB',
  ADABTC: 'ADA-BTC',
  ADAETH: 'ADA-ETH',
  PPTBTC: 'PPT-BTC',
  PPTETH: 'PPT-ETH',
  CMTBTC: 'CMT-BTC',
  CMTETH: 'CMT-ETH',
  CMTBNB: 'CMT-BNB',
  XLMBTC: 'XLM-BTC',
  XLMETH: 'XLM-ETH',
  XLMBNB: 'XLM-BNB',
  CNDBTC: 'CND-BTC',
  CNDETH: 'CND-ETH',
  CNDBNB: 'CND-BNB',
  LENDBTC: 'LEND-BTC',
  LENDETH: 'LEND-ETH',
  WABIBTC: 'WABI-BTC',
  WABIETH: 'WABI-ETH',
  WABIBNB: 'WABI-BNB',
  LTCETH: 'LTC-ETH',
  LTCUSDT: 'LTC-USDT',
  LTCBNB: 'LTC-BNB',
  TNBBTC: 'TNB-BTC',
  TNBETH: 'TNB-ETH',
  WAVESBTC: 'WAVES-BTC',
  WAVESETH: 'WAVES-ETH',
  WAVESBNB: 'WAVES-BNB',
  GTOBTC: 'GTO-BTC',
  GTOETH: 'GTO-ETH',
  GTOBNB: 'GTO-BNB',
  ICXBTC: 'ICX-BTC',
  ICXETH: 'ICX-ETH',
  ICXBNB: 'ICX-BNB',
  OSTBTC: 'OST-BTC',
  OSTETH: 'OST-ETH',
  OSTBNB: 'OST-BNB',
  ELFBTC: 'ELF-BTC',
  ELFETH: 'ELF-ETH',
  AIONBTC: 'AION-BTC',
  AIONETH: 'AION-ETH',
  AIONBNB: 'AION-BNB',
  NEBLBTC: 'NEBL-BTC',
  NEBLETH: 'NEBL-ETH',
  NEBLBNB: 'NEBL-BNB',
  BRDBTC: 'BRD-BTC',
  BRDETH: 'BRD-ETH',
  BRDBNB: 'BRD-BNB',
  MCOBNB: 'MCO-BNB',
  EDOBTC: 'EDO-BTC',
  EDOETH: 'EDO-ETH',
  WINGSBTC: 'WINGS-BTC',
  WINGSETH: 'WINGS-ETH',
  NAVBTC: 'NAV-BTC',
  NAVETH: 'NAV-ETH',
  NAVBNB: 'NAV-BNB',
  LUNBTC: 'LUN-BTC',
  LUNETH: 'LUN-ETH',
  TRIGBTC: 'TRIG-BTC',
  TRIGETH: 'TRIG-ETH',
  TRIGBNB: 'TRIG-BNB',
  APPCBTC: 'APPC-BTC',
  APPCETH: 'APPC-ETH',
  APPCBNB: 'APPC-BNB',
  VIBEBTC: 'VIBE-BTC',
  VIBEETH: 'VIBE-ETH',
  RLCBTC: 'RLC-BTC',
  RLCETH: 'RLC-ETH',
  RLCBNB: 'RLC-BNB',
  INSBTC: 'INS-BTC',
  INSETH: 'INS-ETH',
  PIVXBTC: 'PIVX-BTC',
  PIVXETH: 'PIVX-ETH',
  PIVXBNB: 'PIVX-BNB',
  IOSTBTC: 'IOST-BTC',
  IOSTETH: 'IOST-ETH',
  CHATBTC: 'CHAT-BTC',
  CHATETH: 'CHAT-ETH',
  STEEMBTC: 'STEEM-BTC',
  STEEMETH: 'STEEM-ETH',
  STEEMBNB: 'STEEM-BNB',
  NANOBTC: 'NANO-BTC',
  NANOETH: 'NANO-ETH',
  NANOBNB: 'NANO-BNB',
  VIABTC: 'VIA-BTC',
  VIAETH: 'VIA-ETH',
  VIABNB: 'VIA-BNB',
  BLZBTC: 'BLZ-BTC',
  BLZETH: 'BLZ-ETH',
  BLZBNB: 'BLZ-BNB',
  AEBTC: 'AE-BTC',
  AEETH: 'AE-ETH',
  AEBNB: 'AE-BNB',
  RPXBTC: 'RPX-BTC',
  RPXETH: 'RPX-ETH',
  RPXBNB: 'RPX-BNB',
  NCASHBTC: 'NCASH-BTC',
  NCASHETH: 'NCASH-ETH',
  NCASHBNB: 'NCASH-BNB',
  POABTC: 'POA-BTC',
  POAETH: 'POA-ETH',
  POABNB: 'POA-BNB',
  ZILBTC: 'ZIL-BTC',
  ZILETH: 'ZIL-ETH',
  ZILBNB: 'ZIL-BNB',
  ONTBTC: 'ONT-BTC',
  ONTETH: 'ONT-ETH',
  ONTBNB: 'ONT-BNB',
  STORMBTC: 'STORM-BTC',
  STORMETH: 'STORM-ETH',
  STORMBNB: 'STORM-BNB',
  QTUMBNB: 'QTUM-BNB',
  QTUMUSDT: 'QTUM-USDT',
  XEMBTC: 'XEM-BTC',
  XEMETH: 'XEM-ETH',
  XEMBNB: 'XEM-BNB',
  WANBTC: 'WAN-BTC',
  WANETH: 'WAN-ETH',
  WANBNB: 'WAN-BNB',
  QLCBTC: 'QLC-BTC',
  QLCETH: 'QLC-ETH',
};

const pairInfo = {
  ETHBTC: {
    symbol: 'ETHBTC',
    status: 'TRADING',
    baseAsset: 'ETH',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.00100000',
        maxQty: '100000.00000000',
        stepSize: '0.00100000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'ETH-BTC'
  },
  LTCBTC: {
    symbol: 'LTCBTC',
    status: 'TRADING',
    baseAsset: 'LTC',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '100000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'LTC-BTC'
  },
  BNBBTC: {
    symbol: 'BNBBTC',
    status: 'TRADING',
    baseAsset: 'BNB',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'BNB-BTC'
  },
  NEOBTC: {
    symbol: 'NEOBTC',
    status: 'TRADING',
    baseAsset: 'NEO',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '100000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'NEO-BTC'
  },
  QTUMETH: {
    symbol: 'QTUMETH',
    status: 'TRADING',
    baseAsset: 'QTUM',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'QTUM-ETH'
  },
  EOSETH: {
    symbol: 'EOSETH',
    status: 'TRADING',
    baseAsset: 'EOS',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'EOS-ETH'
  },
  SNTETH: {
    symbol: 'SNTETH',
    status: 'TRADING',
    baseAsset: 'SNT',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'SNT-ETH'
  },
  BNTETH: {
    symbol: 'BNTETH',
    status: 'TRADING',
    baseAsset: 'BNT',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'BNT-ETH'
  },
  BCCBTC: {
    symbol: 'BCCBTC',
    status: 'TRADING',
    baseAsset: 'BCC',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.00100000',
        maxQty: '100000.00000000',
        stepSize: '0.00100000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'BCC-BTC'
  },
  GASBTC: {
    symbol: 'GASBTC',
    status: 'TRADING',
    baseAsset: 'GAS',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '100000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'GAS-BTC'
  },
  BNBETH: {
    symbol: 'BNBETH',
    status: 'TRADING',
    baseAsset: 'BNB',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'BNB-ETH'
  },
  BTCUSDT: {
    symbol: 'BTCUSDT',
    status: 'TRADING',
    baseAsset: 'BTC',
    baseAssetPrecision: 8,
    quoteAsset: 'USDT',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.01000000',
        maxPrice: '10000000.00000000',
        tickSize: '0.01000000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.00000100',
        maxQty: '10000000.00000000',
        stepSize: '0.00000100'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '10.00000000'
      }
    ],
    pair: 'BTC-USDT'
  },
  ETHUSDT: {
    symbol: 'ETHUSDT',
    status: 'TRADING',
    baseAsset: 'ETH',
    baseAssetPrecision: 8,
    quoteAsset: 'USDT',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.01000000',
        maxPrice: '10000000.00000000',
        tickSize: '0.01000000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.00001000',
        maxQty: '10000000.00000000',
        stepSize: '0.00001000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '10.00000000'
      }
    ],
    pair: 'ETH-USDT'
  },
  HSRBTC: {
    symbol: 'HSRBTC',
    status: 'TRADING',
    baseAsset: 'HSR',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'HSR-BTC'
  },
  OAXETH: {
    symbol: 'OAXETH',
    status: 'TRADING',
    baseAsset: 'OAX',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'OAX-ETH'
  },
  DNTETH: {
    symbol: 'DNTETH',
    status: 'TRADING',
    baseAsset: 'DNT',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'DNT-ETH'
  },
  MCOETH: {
    symbol: 'MCOETH',
    status: 'TRADING',
    baseAsset: 'MCO',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'MCO-ETH'
  },
  ICNETH: {
    symbol: 'ICNETH',
    status: 'TRADING',
    baseAsset: 'ICN',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'ICN-ETH'
  },
  MCOBTC: {
    symbol: 'MCOBTC',
    status: 'TRADING',
    baseAsset: 'MCO',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'MCO-BTC'
  },
  WTCBTC: {
    symbol: 'WTCBTC',
    status: 'TRADING',
    baseAsset: 'WTC',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'WTC-BTC'
  },
  WTCETH: {
    symbol: 'WTCETH',
    status: 'TRADING',
    baseAsset: 'WTC',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'WTC-ETH'
  },
  LRCBTC: {
    symbol: 'LRCBTC',
    status: 'TRADING',
    baseAsset: 'LRC',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'LRC-BTC'
  },
  LRCETH: {
    symbol: 'LRCETH',
    status: 'TRADING',
    baseAsset: 'LRC',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'LRC-ETH'
  },
  QTUMBTC: {
    symbol: 'QTUMBTC',
    status: 'TRADING',
    baseAsset: 'QTUM',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'QTUM-BTC'
  },
  YOYOBTC: {
    symbol: 'YOYOBTC',
    status: 'TRADING',
    baseAsset: 'YOYO',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'YOYO-BTC'
  },
  OMGBTC: {
    symbol: 'OMGBTC',
    status: 'TRADING',
    baseAsset: 'OMG',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'OMG-BTC'
  },
  OMGETH: {
    symbol: 'OMGETH',
    status: 'TRADING',
    baseAsset: 'OMG',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'OMG-ETH'
  },
  ZRXBTC: {
    symbol: 'ZRXBTC',
    status: 'TRADING',
    baseAsset: 'ZRX',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'ZRX-BTC'
  },
  ZRXETH: {
    symbol: 'ZRXETH',
    status: 'TRADING',
    baseAsset: 'ZRX',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'ZRX-ETH'
  },
  STRATBTC: {
    symbol: 'STRATBTC',
    status: 'TRADING',
    baseAsset: 'STRAT',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'STRAT-BTC'
  },
  STRATETH: {
    symbol: 'STRATETH',
    status: 'TRADING',
    baseAsset: 'STRAT',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'STRAT-ETH'
  },
  SNGLSBTC: {
    symbol: 'SNGLSBTC',
    status: 'TRADING',
    baseAsset: 'SNGLS',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'SNGLS-BTC'
  },
  SNGLSETH: {
    symbol: 'SNGLSETH',
    status: 'TRADING',
    baseAsset: 'SNGLS',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'SNGLS-ETH'
  },
  BQXBTC: {
    symbol: 'BQXBTC',
    status: 'TRADING',
    baseAsset: 'BQX',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'BQX-BTC'
  },
  BQXETH: {
    symbol: 'BQXETH',
    status: 'TRADING',
    baseAsset: 'BQX',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'BQX-ETH'
  },
  KNCBTC: {
    symbol: 'KNCBTC',
    status: 'TRADING',
    baseAsset: 'KNC',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'KNC-BTC'
  },
  KNCETH: {
    symbol: 'KNCETH',
    status: 'TRADING',
    baseAsset: 'KNC',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'KNC-ETH'
  },
  FUNBTC: {
    symbol: 'FUNBTC',
    status: 'TRADING',
    baseAsset: 'FUN',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'FUN-BTC'
  },
  FUNETH: {
    symbol: 'FUNETH',
    status: 'TRADING',
    baseAsset: 'FUN',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'FUN-ETH'
  },
  SNMBTC: {
    symbol: 'SNMBTC',
    status: 'TRADING',
    baseAsset: 'SNM',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'SNM-BTC'
  },
  SNMETH: {
    symbol: 'SNMETH',
    status: 'TRADING',
    baseAsset: 'SNM',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'SNM-ETH'
  },
  NEOETH: {
    symbol: 'NEOETH',
    status: 'TRADING',
    baseAsset: 'NEO',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'NEO-ETH'
  },
  IOTABTC: {
    symbol: 'IOTABTC',
    status: 'TRADING',
    baseAsset: 'IOTA',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'IOTA-BTC'
  },
  IOTAETH: {
    symbol: 'IOTAETH',
    status: 'TRADING',
    baseAsset: 'IOTA',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'IOTA-ETH'
  },
  LINKBTC: {
    symbol: 'LINKBTC',
    status: 'TRADING',
    baseAsset: 'LINK',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'LINK-BTC'
  },
  LINKETH: {
    symbol: 'LINKETH',
    status: 'TRADING',
    baseAsset: 'LINK',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'LINK-ETH'
  },
  XVGBTC: {
    symbol: 'XVGBTC',
    status: 'TRADING',
    baseAsset: 'XVG',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'XVG-BTC'
  },
  XVGETH: {
    symbol: 'XVGETH',
    status: 'TRADING',
    baseAsset: 'XVG',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'XVG-ETH'
  },
  CTRBTC: {
    symbol: 'CTRBTC',
    status: 'TRADING',
    baseAsset: 'CTR',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'CTR-BTC'
  },
  CTRETH: {
    symbol: 'CTRETH',
    status: 'TRADING',
    baseAsset: 'CTR',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'CTR-ETH'
  },
  SALTBTC: {
    symbol: 'SALTBTC',
    status: 'TRADING',
    baseAsset: 'SALT',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'SALT-BTC'
  },
  SALTETH: {
    symbol: 'SALTETH',
    status: 'TRADING',
    baseAsset: 'SALT',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'SALT-ETH'
  },
  MDABTC: {
    symbol: 'MDABTC',
    status: 'TRADING',
    baseAsset: 'MDA',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'MDA-BTC'
  },
  MDAETH: {
    symbol: 'MDAETH',
    status: 'TRADING',
    baseAsset: 'MDA',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'MDA-ETH'
  },
  MTLBTC: {
    symbol: 'MTLBTC',
    status: 'TRADING',
    baseAsset: 'MTL',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'MTL-BTC'
  },
  MTLETH: {
    symbol: 'MTLETH',
    status: 'TRADING',
    baseAsset: 'MTL',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'MTL-ETH'
  },
  SUBBTC: {
    symbol: 'SUBBTC',
    status: 'TRADING',
    baseAsset: 'SUB',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'SUB-BTC'
  },
  SUBETH: {
    symbol: 'SUBETH',
    status: 'TRADING',
    baseAsset: 'SUB',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'SUB-ETH'
  },
  EOSBTC: {
    symbol: 'EOSBTC',
    status: 'TRADING',
    baseAsset: 'EOS',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'EOS-BTC'
  },
  SNTBTC: {
    symbol: 'SNTBTC',
    status: 'TRADING',
    baseAsset: 'SNT',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'SNT-BTC'
  },
  ETCETH: {
    symbol: 'ETCETH',
    status: 'TRADING',
    baseAsset: 'ETC',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'ETC-ETH'
  },
  ETCBTC: {
    symbol: 'ETCBTC',
    status: 'TRADING',
    baseAsset: 'ETC',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'ETC-BTC'
  },
  MTHBTC: {
    symbol: 'MTHBTC',
    status: 'TRADING',
    baseAsset: 'MTH',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'MTH-BTC'
  },
  MTHETH: {
    symbol: 'MTHETH',
    status: 'TRADING',
    baseAsset: 'MTH',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'MTH-ETH'
  },
  ENGBTC: {
    symbol: 'ENGBTC',
    status: 'TRADING',
    baseAsset: 'ENG',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'ENG-BTC'
  },
  ENGETH: {
    symbol: 'ENGETH',
    status: 'TRADING',
    baseAsset: 'ENG',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'ENG-ETH'
  },
  DNTBTC: {
    symbol: 'DNTBTC',
    status: 'TRADING',
    baseAsset: 'DNT',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'DNT-BTC'
  },
  ZECBTC: {
    symbol: 'ZECBTC',
    status: 'TRADING',
    baseAsset: 'ZEC',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.00100000',
        maxQty: '10000000.00000000',
        stepSize: '0.00100000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'ZEC-BTC'
  },
  ZECETH: {
    symbol: 'ZECETH',
    status: 'TRADING',
    baseAsset: 'ZEC',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '100000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.00100000',
        maxQty: '10000000.00000000',
        stepSize: '0.00100000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'ZEC-ETH'
  },
  BNTBTC: {
    symbol: 'BNTBTC',
    status: 'TRADING',
    baseAsset: 'BNT',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'BNT-BTC'
  },
  ASTBTC: {
    symbol: 'ASTBTC',
    status: 'TRADING',
    baseAsset: 'AST',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'AST-BTC'
  },
  ASTETH: {
    symbol: 'ASTETH',
    status: 'TRADING',
    baseAsset: 'AST',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'AST-ETH'
  },
  DASHBTC: {
    symbol: 'DASHBTC',
    status: 'TRADING',
    baseAsset: 'DASH',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.00100000',
        maxQty: '10000000.00000000',
        stepSize: '0.00100000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'DASH-BTC'
  },
  DASHETH: {
    symbol: 'DASHETH',
    status: 'TRADING',
    baseAsset: 'DASH',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '100000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.00100000',
        maxQty: '10000000.00000000',
        stepSize: '0.00100000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'DASH-ETH'
  },
  OAXBTC: {
    symbol: 'OAXBTC',
    status: 'TRADING',
    baseAsset: 'OAX',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'OAX-BTC'
  },
  ICNBTC: {
    symbol: 'ICNBTC',
    status: 'TRADING',
    baseAsset: 'ICN',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'ICN-BTC'
  },
  BTGBTC: {
    symbol: 'BTGBTC',
    status: 'TRADING',
    baseAsset: 'BTG',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'BTG-BTC'
  },
  BTGETH: {
    symbol: 'BTGETH',
    status: 'TRADING',
    baseAsset: 'BTG',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'BTG-ETH'
  },
  EVXBTC: {
    symbol: 'EVXBTC',
    status: 'TRADING',
    baseAsset: 'EVX',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'EVX-BTC'
  },
  EVXETH: {
    symbol: 'EVXETH',
    status: 'TRADING',
    baseAsset: 'EVX',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'EVX-ETH'
  },
  REQBTC: {
    symbol: 'REQBTC',
    status: 'TRADING',
    baseAsset: 'REQ',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'REQ-BTC'
  },
  REQETH: {
    symbol: 'REQETH',
    status: 'TRADING',
    baseAsset: 'REQ',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'REQ-ETH'
  },
  VIBBTC: {
    symbol: 'VIBBTC',
    status: 'TRADING',
    baseAsset: 'VIB',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'VIB-BTC'
  },
  VIBETH: {
    symbol: 'VIBETH',
    status: 'TRADING',
    baseAsset: 'VIB',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'VIB-ETH'
  },
  HSRETH: {
    symbol: 'HSRETH',
    status: 'TRADING',
    baseAsset: 'HSR',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'HSR-ETH'
  },
  TRXBTC: {
    symbol: 'TRXBTC',
    status: 'TRADING',
    baseAsset: 'TRX',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'TRX-BTC'
  },
  TRXETH: {
    symbol: 'TRXETH',
    status: 'TRADING',
    baseAsset: 'TRX',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'TRX-ETH'
  },
  POWRBTC: {
    symbol: 'POWRBTC',
    status: 'TRADING',
    baseAsset: 'POWR',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'POWR-BTC'
  },
  POWRETH: {
    symbol: 'POWRETH',
    status: 'TRADING',
    baseAsset: 'POWR',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'POWR-ETH'
  },
  ARKBTC: {
    symbol: 'ARKBTC',
    status: 'TRADING',
    baseAsset: 'ARK',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'ARK-BTC'
  },
  ARKETH: {
    symbol: 'ARKETH',
    status: 'TRADING',
    baseAsset: 'ARK',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'ARK-ETH'
  },
  YOYOETH: {
    symbol: 'YOYOETH',
    status: 'TRADING',
    baseAsset: 'YOYO',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'YOYO-ETH'
  },
  XRPBTC: {
    symbol: 'XRPBTC',
    status: 'TRADING',
    baseAsset: 'XRP',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'XRP-BTC'
  },
  XRPETH: {
    symbol: 'XRPETH',
    status: 'TRADING',
    baseAsset: 'XRP',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'XRP-ETH'
  },
  MODBTC: {
    symbol: 'MODBTC',
    status: 'TRADING',
    baseAsset: 'MOD',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'MOD-BTC'
  },
  MODETH: {
    symbol: 'MODETH',
    status: 'TRADING',
    baseAsset: 'MOD',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'MOD-ETH'
  },
  ENJBTC: {
    symbol: 'ENJBTC',
    status: 'TRADING',
    baseAsset: 'ENJ',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'ENJ-BTC'
  },
  ENJETH: {
    symbol: 'ENJETH',
    status: 'TRADING',
    baseAsset: 'ENJ',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'ENJ-ETH'
  },
  STORJBTC: {
    symbol: 'STORJBTC',
    status: 'TRADING',
    baseAsset: 'STORJ',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'STORJ-BTC'
  },
  STORJETH: {
    symbol: 'STORJETH',
    status: 'TRADING',
    baseAsset: 'STORJ',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'STORJ-ETH'
  },
  BNBUSDT: {
    symbol: 'BNBUSDT',
    status: 'TRADING',
    baseAsset: 'BNB',
    baseAssetPrecision: 8,
    quoteAsset: 'USDT',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00010000',
        maxPrice: '100000.00000000',
        tickSize: '0.00010000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '10.00000000'
      }
    ],
    pair: 'BNB-USDT'
  },
  VENBNB: {
    symbol: 'VENBNB',
    status: 'TRADING',
    baseAsset: 'VEN',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00010000',
        maxPrice: '100000.00000000',
        tickSize: '0.00010000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'VEN-BNB'
  },
  YOYOBNB: {
    symbol: 'YOYOBNB',
    status: 'TRADING',
    baseAsset: 'YOYO',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'YOYO-BNB'
  },
  POWRBNB: {
    symbol: 'POWRBNB',
    status: 'TRADING',
    baseAsset: 'POWR',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'POWR-BNB'
  },
  VENBTC: {
    symbol: 'VENBTC',
    status: 'TRADING',
    baseAsset: 'VEN',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'VEN-BTC'
  },
  VENETH: {
    symbol: 'VENETH',
    status: 'TRADING',
    baseAsset: 'VEN',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'VEN-ETH'
  },
  KMDBTC: {
    symbol: 'KMDBTC',
    status: 'TRADING',
    baseAsset: 'KMD',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'KMD-BTC'
  },
  KMDETH: {
    symbol: 'KMDETH',
    status: 'TRADING',
    baseAsset: 'KMD',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'KMD-ETH'
  },
  NULSBNB: {
    symbol: 'NULSBNB',
    status: 'TRADING',
    baseAsset: 'NULS',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'NULS-BNB'
  },
  RCNBTC: {
    symbol: 'RCNBTC',
    status: 'TRADING',
    baseAsset: 'RCN',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'RCN-BTC'
  },
  RCNETH: {
    symbol: 'RCNETH',
    status: 'TRADING',
    baseAsset: 'RCN',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'RCN-ETH'
  },
  RCNBNB: {
    symbol: 'RCNBNB',
    status: 'TRADING',
    baseAsset: 'RCN',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'RCN-BNB'
  },
  NULSBTC: {
    symbol: 'NULSBTC',
    status: 'TRADING',
    baseAsset: 'NULS',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'NULS-BTC'
  },
  NULSETH: {
    symbol: 'NULSETH',
    status: 'TRADING',
    baseAsset: 'NULS',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'NULS-ETH'
  },
  RDNBTC: {
    symbol: 'RDNBTC',
    status: 'TRADING',
    baseAsset: 'RDN',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'RDN-BTC'
  },
  RDNETH: {
    symbol: 'RDNETH',
    status: 'TRADING',
    baseAsset: 'RDN',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'RDN-ETH'
  },
  RDNBNB: {
    symbol: 'RDNBNB',
    status: 'TRADING',
    baseAsset: 'RDN',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'RDN-BNB'
  },
  XMRBTC: {
    symbol: 'XMRBTC',
    status: 'TRADING',
    baseAsset: 'XMR',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.00100000',
        maxQty: '10000000.00000000',
        stepSize: '0.00100000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'XMR-BTC'
  },
  XMRETH: {
    symbol: 'XMRETH',
    status: 'TRADING',
    baseAsset: 'XMR',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '100000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.00100000',
        maxQty: '10000000.00000000',
        stepSize: '0.00100000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'XMR-ETH'
  },
  DLTBNB: {
    symbol: 'DLTBNB',
    status: 'TRADING',
    baseAsset: 'DLT',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'DLT-BNB'
  },
  WTCBNB: {
    symbol: 'WTCBNB',
    status: 'TRADING',
    baseAsset: 'WTC',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00010000',
        maxPrice: '100000.00000000',
        tickSize: '0.00010000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'WTC-BNB'
  },
  DLTBTC: {
    symbol: 'DLTBTC',
    status: 'TRADING',
    baseAsset: 'DLT',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'DLT-BTC'
  },
  DLTETH: {
    symbol: 'DLTETH',
    status: 'TRADING',
    baseAsset: 'DLT',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'DLT-ETH'
  },
  AMBBTC: {
    symbol: 'AMBBTC',
    status: 'TRADING',
    baseAsset: 'AMB',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'AMB-BTC'
  },
  AMBETH: {
    symbol: 'AMBETH',
    status: 'TRADING',
    baseAsset: 'AMB',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'AMB-ETH'
  },
  AMBBNB: {
    symbol: 'AMBBNB',
    status: 'TRADING',
    baseAsset: 'AMB',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'AMB-BNB'
  },
  BCCETH: {
    symbol: 'BCCETH',
    status: 'TRADING',
    baseAsset: 'BCC',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '100000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.00100000',
        maxQty: '10000000.00000000',
        stepSize: '0.00100000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'BCC-ETH'
  },
  BCCUSDT: {
    symbol: 'BCCUSDT',
    status: 'TRADING',
    baseAsset: 'BCC',
    baseAssetPrecision: 8,
    quoteAsset: 'USDT',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.01000000',
        maxPrice: '10000000.00000000',
        tickSize: '0.01000000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.00001000',
        maxQty: '10000000.00000000',
        stepSize: '0.00001000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '10.00000000'
      }
    ],
    pair: 'BCC-USDT'
  },
  BCCBNB: {
    symbol: 'BCCBNB',
    status: 'TRADING',
    baseAsset: 'BCC',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.01000000',
        maxPrice: '100000.00000000',
        tickSize: '0.01000000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.00001000',
        maxQty: '10000000.00000000',
        stepSize: '0.00001000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'BCC-BNB'
  },
  BATBTC: {
    symbol: 'BATBTC',
    status: 'TRADING',
    baseAsset: 'BAT',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'BAT-BTC'
  },
  BATETH: {
    symbol: 'BATETH',
    status: 'TRADING',
    baseAsset: 'BAT',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'BAT-ETH'
  },
  BATBNB: {
    symbol: 'BATBNB',
    status: 'TRADING',
    baseAsset: 'BAT',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'BAT-BNB'
  },
  BCPTBTC: {
    symbol: 'BCPTBTC',
    status: 'TRADING',
    baseAsset: 'BCPT',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'BCPT-BTC'
  },
  BCPTETH: {
    symbol: 'BCPTETH',
    status: 'TRADING',
    baseAsset: 'BCPT',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'BCPT-ETH'
  },
  BCPTBNB: {
    symbol: 'BCPTBNB',
    status: 'TRADING',
    baseAsset: 'BCPT',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'BCPT-BNB'
  },
  ARNBTC: {
    symbol: 'ARNBTC',
    status: 'TRADING',
    baseAsset: 'ARN',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'ARN-BTC'
  },
  ARNETH: {
    symbol: 'ARNETH',
    status: 'TRADING',
    baseAsset: 'ARN',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'ARN-ETH'
  },
  GVTBTC: {
    symbol: 'GVTBTC',
    status: 'TRADING',
    baseAsset: 'GVT',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'GVT-BTC'
  },
  GVTETH: {
    symbol: 'GVTETH',
    status: 'TRADING',
    baseAsset: 'GVT',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'GVT-ETH'
  },
  CDTBTC: {
    symbol: 'CDTBTC',
    status: 'TRADING',
    baseAsset: 'CDT',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'CDT-BTC'
  },
  CDTETH: {
    symbol: 'CDTETH',
    status: 'TRADING',
    baseAsset: 'CDT',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'CDT-ETH'
  },
  GXSBTC: {
    symbol: 'GXSBTC',
    status: 'TRADING',
    baseAsset: 'GXS',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'GXS-BTC'
  },
  GXSETH: {
    symbol: 'GXSETH',
    status: 'TRADING',
    baseAsset: 'GXS',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'GXS-ETH'
  },
  NEOUSDT: {
    symbol: 'NEOUSDT',
    status: 'TRADING',
    baseAsset: 'NEO',
    baseAssetPrecision: 8,
    quoteAsset: 'USDT',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00100000',
        maxPrice: '10000000.00000000',
        tickSize: '0.00100000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.00100000',
        maxQty: '10000000.00000000',
        stepSize: '0.00100000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '10.00000000'
      }
    ],
    pair: 'NEO-USDT'
  },
  NEOBNB: {
    symbol: 'NEOBNB',
    status: 'TRADING',
    baseAsset: 'NEO',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00100000',
        maxPrice: '10000000.00000000',
        tickSize: '0.00100000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.00100000',
        maxQty: '10000000.00000000',
        stepSize: '0.00100000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'NEO-BNB'
  },
  POEBTC: {
    symbol: 'POEBTC',
    status: 'TRADING',
    baseAsset: 'POE',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'POE-BTC'
  },
  POEETH: {
    symbol: 'POEETH',
    status: 'TRADING',
    baseAsset: 'POE',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'POE-ETH'
  },
  QSPBTC: {
    symbol: 'QSPBTC',
    status: 'TRADING',
    baseAsset: 'QSP',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'QSP-BTC'
  },
  QSPETH: {
    symbol: 'QSPETH',
    status: 'TRADING',
    baseAsset: 'QSP',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'QSP-ETH'
  },
  QSPBNB: {
    symbol: 'QSPBNB',
    status: 'TRADING',
    baseAsset: 'QSP',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'QSP-BNB'
  },
  BTSBTC: {
    symbol: 'BTSBTC',
    status: 'TRADING',
    baseAsset: 'BTS',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'BTS-BTC'
  },
  BTSETH: {
    symbol: 'BTSETH',
    status: 'TRADING',
    baseAsset: 'BTS',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'BTS-ETH'
  },
  BTSBNB: {
    symbol: 'BTSBNB',
    status: 'TRADING',
    baseAsset: 'BTS',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'BTS-BNB'
  },
  XZCBTC: {
    symbol: 'XZCBTC',
    status: 'TRADING',
    baseAsset: 'XZC',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'XZC-BTC'
  },
  XZCETH: {
    symbol: 'XZCETH',
    status: 'TRADING',
    baseAsset: 'XZC',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'XZC-ETH'
  },
  XZCBNB: {
    symbol: 'XZCBNB',
    status: 'TRADING',
    baseAsset: 'XZC',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00100000',
        maxPrice: '10000000.00000000',
        tickSize: '0.00100000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.00100000',
        maxQty: '10000000.00000000',
        stepSize: '0.00100000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'XZC-BNB'
  },
  LSKBTC: {
    symbol: 'LSKBTC',
    status: 'TRADING',
    baseAsset: 'LSK',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'LSK-BTC'
  },
  LSKETH: {
    symbol: 'LSKETH',
    status: 'TRADING',
    baseAsset: 'LSK',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'LSK-ETH'
  },
  LSKBNB: {
    symbol: 'LSKBNB',
    status: 'TRADING',
    baseAsset: 'LSK',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00010000',
        maxPrice: '100000.00000000',
        tickSize: '0.00010000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'LSK-BNB'
  },
  TNTBTC: {
    symbol: 'TNTBTC',
    status: 'TRADING',
    baseAsset: 'TNT',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'TNT-BTC'
  },
  TNTETH: {
    symbol: 'TNTETH',
    status: 'TRADING',
    baseAsset: 'TNT',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'TNT-ETH'
  },
  FUELBTC: {
    symbol: 'FUELBTC',
    status: 'TRADING',
    baseAsset: 'FUEL',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'FUEL-BTC'
  },
  FUELETH: {
    symbol: 'FUELETH',
    status: 'TRADING',
    baseAsset: 'FUEL',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'FUEL-ETH'
  },
  MANABTC: {
    symbol: 'MANABTC',
    status: 'TRADING',
    baseAsset: 'MANA',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'MANA-BTC'
  },
  MANAETH: {
    symbol: 'MANAETH',
    status: 'TRADING',
    baseAsset: 'MANA',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'MANA-ETH'
  },
  BCDBTC: {
    symbol: 'BCDBTC',
    status: 'TRADING',
    baseAsset: 'BCD',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.00100000',
        maxQty: '10000000.00000000',
        stepSize: '0.00100000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'BCD-BTC'
  },
  BCDETH: {
    symbol: 'BCDETH',
    status: 'TRADING',
    baseAsset: 'BCD',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '100000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.00100000',
        maxQty: '10000000.00000000',
        stepSize: '0.00100000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'BCD-ETH'
  },
  DGDBTC: {
    symbol: 'DGDBTC',
    status: 'TRADING',
    baseAsset: 'DGD',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.00100000',
        maxQty: '10000000.00000000',
        stepSize: '0.00100000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'DGD-BTC'
  },
  DGDETH: {
    symbol: 'DGDETH',
    status: 'TRADING',
    baseAsset: 'DGD',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '100000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.00100000',
        maxQty: '10000000.00000000',
        stepSize: '0.00100000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'DGD-ETH'
  },
  IOTABNB: {
    symbol: 'IOTABNB',
    status: 'TRADING',
    baseAsset: 'IOTA',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'IOTA-BNB'
  },
  ADXBTC: {
    symbol: 'ADXBTC',
    status: 'TRADING',
    baseAsset: 'ADX',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'ADX-BTC'
  },
  ADXETH: {
    symbol: 'ADXETH',
    status: 'TRADING',
    baseAsset: 'ADX',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'ADX-ETH'
  },
  ADXBNB: {
    symbol: 'ADXBNB',
    status: 'TRADING',
    baseAsset: 'ADX',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'ADX-BNB'
  },
  ADABTC: {
    symbol: 'ADABTC',
    status: 'TRADING',
    baseAsset: 'ADA',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'ADA-BTC'
  },
  ADAETH: {
    symbol: 'ADAETH',
    status: 'TRADING',
    baseAsset: 'ADA',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'ADA-ETH'
  },
  PPTBTC: {
    symbol: 'PPTBTC',
    status: 'TRADING',
    baseAsset: 'PPT',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'PPT-BTC'
  },
  PPTETH: {
    symbol: 'PPTETH',
    status: 'TRADING',
    baseAsset: 'PPT',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'PPT-ETH'
  },
  CMTBTC: {
    symbol: 'CMTBTC',
    status: 'TRADING',
    baseAsset: 'CMT',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'CMT-BTC'
  },
  CMTETH: {
    symbol: 'CMTETH',
    status: 'TRADING',
    baseAsset: 'CMT',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'CMT-ETH'
  },
  CMTBNB: {
    symbol: 'CMTBNB',
    status: 'TRADING',
    baseAsset: 'CMT',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'CMT-BNB'
  },
  XLMBTC: {
    symbol: 'XLMBTC',
    status: 'TRADING',
    baseAsset: 'XLM',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'XLM-BTC'
  },
  XLMETH: {
    symbol: 'XLMETH',
    status: 'TRADING',
    baseAsset: 'XLM',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'XLM-ETH'
  },
  XLMBNB: {
    symbol: 'XLMBNB',
    status: 'TRADING',
    baseAsset: 'XLM',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'XLM-BNB'
  },
  CNDBTC: {
    symbol: 'CNDBTC',
    status: 'TRADING',
    baseAsset: 'CND',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'CND-BTC'
  },
  CNDETH: {
    symbol: 'CNDETH',
    status: 'TRADING',
    baseAsset: 'CND',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'CND-ETH'
  },
  CNDBNB: {
    symbol: 'CNDBNB',
    status: 'TRADING',
    baseAsset: 'CND',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'CND-BNB'
  },
  LENDBTC: {
    symbol: 'LENDBTC',
    status: 'TRADING',
    baseAsset: 'LEND',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'LEND-BTC'
  },
  LENDETH: {
    symbol: 'LENDETH',
    status: 'TRADING',
    baseAsset: 'LEND',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'LEND-ETH'
  },
  WABIBTC: {
    symbol: 'WABIBTC',
    status: 'TRADING',
    baseAsset: 'WABI',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'WABI-BTC'
  },
  WABIETH: {
    symbol: 'WABIETH',
    status: 'TRADING',
    baseAsset: 'WABI',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'WABI-ETH'
  },
  WABIBNB: {
    symbol: 'WABIBNB',
    status: 'TRADING',
    baseAsset: 'WABI',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'WABI-BNB'
  },
  LTCETH: {
    symbol: 'LTCETH',
    status: 'TRADING',
    baseAsset: 'LTC',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '100000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.00100000',
        maxQty: '10000000.00000000',
        stepSize: '0.00100000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'LTC-ETH'
  },
  LTCUSDT: {
    symbol: 'LTCUSDT',
    status: 'TRADING',
    baseAsset: 'LTC',
    baseAssetPrecision: 8,
    quoteAsset: 'USDT',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.01000000',
        maxPrice: '10000000.00000000',
        tickSize: '0.01000000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.00001000',
        maxQty: '10000000.00000000',
        stepSize: '0.00001000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '10.00000000'
      }
    ],
    pair: 'LTC-USDT'
  },
  LTCBNB: {
    symbol: 'LTCBNB',
    status: 'TRADING',
    baseAsset: 'LTC',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.01000000',
        maxPrice: '100000.00000000',
        tickSize: '0.01000000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.00001000',
        maxQty: '10000000.00000000',
        stepSize: '0.00001000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'LTC-BNB'
  },
  TNBBTC: {
    symbol: 'TNBBTC',
    status: 'TRADING',
    baseAsset: 'TNB',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'TNB-BTC'
  },
  TNBETH: {
    symbol: 'TNBETH',
    status: 'TRADING',
    baseAsset: 'TNB',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'TNB-ETH'
  },
  WAVESBTC: {
    symbol: 'WAVESBTC',
    status: 'TRADING',
    baseAsset: 'WAVES',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'WAVES-BTC'
  },
  WAVESETH: {
    symbol: 'WAVESETH',
    status: 'TRADING',
    baseAsset: 'WAVES',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'WAVES-ETH'
  },
  WAVESBNB: {
    symbol: 'WAVESBNB',
    status: 'TRADING',
    baseAsset: 'WAVES',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00010000',
        maxPrice: '100000.00000000',
        tickSize: '0.00010000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'WAVES-BNB'
  },
  GTOBTC: {
    symbol: 'GTOBTC',
    status: 'TRADING',
    baseAsset: 'GTO',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'GTO-BTC'
  },
  GTOETH: {
    symbol: 'GTOETH',
    status: 'TRADING',
    baseAsset: 'GTO',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'GTO-ETH'
  },
  GTOBNB: {
    symbol: 'GTOBNB',
    status: 'TRADING',
    baseAsset: 'GTO',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'GTO-BNB'
  },
  ICXBTC: {
    symbol: 'ICXBTC',
    status: 'TRADING',
    baseAsset: 'ICX',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'ICX-BTC'
  },
  ICXETH: {
    symbol: 'ICXETH',
    status: 'TRADING',
    baseAsset: 'ICX',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'ICX-ETH'
  },
  ICXBNB: {
    symbol: 'ICXBNB',
    status: 'TRADING',
    baseAsset: 'ICX',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'ICX-BNB'
  },
  OSTBTC: {
    symbol: 'OSTBTC',
    status: 'TRADING',
    baseAsset: 'OST',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'OST-BTC'
  },
  OSTETH: {
    symbol: 'OSTETH',
    status: 'TRADING',
    baseAsset: 'OST',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'OST-ETH'
  },
  OSTBNB: {
    symbol: 'OSTBNB',
    status: 'TRADING',
    baseAsset: 'OST',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'OST-BNB'
  },
  ELFBTC: {
    symbol: 'ELFBTC',
    status: 'TRADING',
    baseAsset: 'ELF',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'ELF-BTC'
  },
  ELFETH: {
    symbol: 'ELFETH',
    status: 'TRADING',
    baseAsset: 'ELF',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'ELF-ETH'
  },
  AIONBTC: {
    symbol: 'AIONBTC',
    status: 'TRADING',
    baseAsset: 'AION',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'AION-BTC'
  },
  AIONETH: {
    symbol: 'AIONETH',
    status: 'TRADING',
    baseAsset: 'AION',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'AION-ETH'
  },
  AIONBNB: {
    symbol: 'AIONBNB',
    status: 'TRADING',
    baseAsset: 'AION',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'AION-BNB'
  },
  NEBLBTC: {
    symbol: 'NEBLBTC',
    status: 'TRADING',
    baseAsset: 'NEBL',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'NEBL-BTC'
  },
  NEBLETH: {
    symbol: 'NEBLETH',
    status: 'TRADING',
    baseAsset: 'NEBL',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'NEBL-ETH'
  },
  NEBLBNB: {
    symbol: 'NEBLBNB',
    status: 'TRADING',
    baseAsset: 'NEBL',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'NEBL-BNB'
  },
  BRDBTC: {
    symbol: 'BRDBTC',
    status: 'TRADING',
    baseAsset: 'BRD',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'BRD-BTC'
  },
  BRDETH: {
    symbol: 'BRDETH',
    status: 'TRADING',
    baseAsset: 'BRD',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'BRD-ETH'
  },
  BRDBNB: {
    symbol: 'BRDBNB',
    status: 'TRADING',
    baseAsset: 'BRD',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'BRD-BNB'
  },
  MCOBNB: {
    symbol: 'MCOBNB',
    status: 'TRADING',
    baseAsset: 'MCO',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'MCO-BNB'
  },
  EDOBTC: {
    symbol: 'EDOBTC',
    status: 'TRADING',
    baseAsset: 'EDO',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'EDO-BTC'
  },
  EDOETH: {
    symbol: 'EDOETH',
    status: 'TRADING',
    baseAsset: 'EDO',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'EDO-ETH'
  },
  WINGSBTC: {
    symbol: 'WINGSBTC',
    status: 'TRADING',
    baseAsset: 'WINGS',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'WINGS-BTC'
  },
  WINGSETH: {
    symbol: 'WINGSETH',
    status: 'TRADING',
    baseAsset: 'WINGS',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'WINGS-ETH'
  },
  NAVBTC: {
    symbol: 'NAVBTC',
    status: 'TRADING',
    baseAsset: 'NAV',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'NAV-BTC'
  },
  NAVETH: {
    symbol: 'NAVETH',
    status: 'TRADING',
    baseAsset: 'NAV',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'NAV-ETH'
  },
  NAVBNB: {
    symbol: 'NAVBNB',
    status: 'TRADING',
    baseAsset: 'NAV',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'NAV-BNB'
  },
  LUNBTC: {
    symbol: 'LUNBTC',
    status: 'TRADING',
    baseAsset: 'LUN',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'LUN-BTC'
  },
  LUNETH: {
    symbol: 'LUNETH',
    status: 'TRADING',
    baseAsset: 'LUN',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'LUN-ETH'
  },
  TRIGBTC: {
    symbol: 'TRIGBTC',
    status: 'TRADING',
    baseAsset: 'TRIG',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'TRIG-BTC'
  },
  TRIGETH: {
    symbol: 'TRIGETH',
    status: 'TRADING',
    baseAsset: 'TRIG',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'TRIG-ETH'
  },
  TRIGBNB: {
    symbol: 'TRIGBNB',
    status: 'TRADING',
    baseAsset: 'TRIG',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'TRIG-BNB'
  },
  APPCBTC: {
    symbol: 'APPCBTC',
    status: 'TRADING',
    baseAsset: 'APPC',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'APPC-BTC'
  },
  APPCETH: {
    symbol: 'APPCETH',
    status: 'TRADING',
    baseAsset: 'APPC',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'APPC-ETH'
  },
  APPCBNB: {
    symbol: 'APPCBNB',
    status: 'TRADING',
    baseAsset: 'APPC',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'APPC-BNB'
  },
  VIBEBTC: {
    symbol: 'VIBEBTC',
    status: 'TRADING',
    baseAsset: 'VIBE',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'VIBE-BTC'
  },
  VIBEETH: {
    symbol: 'VIBEETH',
    status: 'TRADING',
    baseAsset: 'VIBE',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'VIBE-ETH'
  },
  RLCBTC: {
    symbol: 'RLCBTC',
    status: 'TRADING',
    baseAsset: 'RLC',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'RLC-BTC'
  },
  RLCETH: {
    symbol: 'RLCETH',
    status: 'TRADING',
    baseAsset: 'RLC',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'RLC-ETH'
  },
  RLCBNB: {
    symbol: 'RLCBNB',
    status: 'TRADING',
    baseAsset: 'RLC',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'RLC-BNB'
  },
  INSBTC: {
    symbol: 'INSBTC',
    status: 'TRADING',
    baseAsset: 'INS',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'INS-BTC'
  },
  INSETH: {
    symbol: 'INSETH',
    status: 'TRADING',
    baseAsset: 'INS',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'INS-ETH'
  },
  PIVXBTC: {
    symbol: 'PIVXBTC',
    status: 'TRADING',
    baseAsset: 'PIVX',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'PIVX-BTC'
  },
  PIVXETH: {
    symbol: 'PIVXETH',
    status: 'TRADING',
    baseAsset: 'PIVX',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'PIVX-ETH'
  },
  PIVXBNB: {
    symbol: 'PIVXBNB',
    status: 'TRADING',
    baseAsset: 'PIVX',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'PIVX-BNB'
  },
  IOSTBTC: {
    symbol: 'IOSTBTC',
    status: 'TRADING',
    baseAsset: 'IOST',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'IOST-BTC'
  },
  IOSTETH: {
    symbol: 'IOSTETH',
    status: 'TRADING',
    baseAsset: 'IOST',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'IOST-ETH'
  },
  CHATBTC: {
    symbol: 'CHATBTC',
    status: 'TRADING',
    baseAsset: 'CHAT',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'CHAT-BTC'
  },
  CHATETH: {
    symbol: 'CHATETH',
    status: 'TRADING',
    baseAsset: 'CHAT',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'CHAT-ETH'
  },
  STEEMBTC: {
    symbol: 'STEEMBTC',
    status: 'TRADING',
    baseAsset: 'STEEM',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'STEEM-BTC'
  },
  STEEMETH: {
    symbol: 'STEEMETH',
    status: 'TRADING',
    baseAsset: 'STEEM',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'STEEM-ETH'
  },
  STEEMBNB: {
    symbol: 'STEEMBNB',
    status: 'TRADING',
    baseAsset: 'STEEM',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'STEEM-BNB'
  },
  NANOBTC: {
    symbol: 'NANOBTC',
    status: 'TRADING',
    baseAsset: 'NANO',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'NANO-BTC'
  },
  NANOETH: {
    symbol: 'NANOETH',
    status: 'TRADING',
    baseAsset: 'NANO',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'NANO-ETH'
  },
  NANOBNB: {
    symbol: 'NANOBNB',
    status: 'TRADING',
    baseAsset: 'NANO',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00010000',
        maxPrice: '100000.00000000',
        tickSize: '0.00010000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'NANO-BNB'
  },
  VIABTC: {
    symbol: 'VIABTC',
    status: 'TRADING',
    baseAsset: 'VIA',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'VIA-BTC'
  },
  VIAETH: {
    symbol: 'VIAETH',
    status: 'TRADING',
    baseAsset: 'VIA',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'VIA-ETH'
  },
  VIABNB: {
    symbol: 'VIABNB',
    status: 'TRADING',
    baseAsset: 'VIA',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'VIA-BNB'
  },
  BLZBTC: {
    symbol: 'BLZBTC',
    status: 'TRADING',
    baseAsset: 'BLZ',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'BLZ-BTC'
  },
  BLZETH: {
    symbol: 'BLZETH',
    status: 'TRADING',
    baseAsset: 'BLZ',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'BLZ-ETH'
  },
  BLZBNB: {
    symbol: 'BLZBNB',
    status: 'TRADING',
    baseAsset: 'BLZ',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'BLZ-BNB'
  },
  AEBTC: {
    symbol: 'AEBTC',
    status: 'TRADING',
    baseAsset: 'AE',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000010',
        maxPrice: '100000.00000000',
        tickSize: '0.00000010'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'AE-BTC'
  },
  AEETH: {
    symbol: 'AEETH',
    status: 'TRADING',
    baseAsset: 'AE',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000100',
        maxPrice: '100000.00000000',
        tickSize: '0.00000100'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '90000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'AE-ETH'
  },
  AEBNB: {
    symbol: 'AEBNB',
    status: 'TRADING',
    baseAsset: 'AE',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'AE-BNB'
  },
  RPXBTC: {
    symbol: 'RPXBTC',
    status: 'TRADING',
    baseAsset: 'RPX',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'RPX-BTC'
  },
  RPXETH: {
    symbol: 'RPXETH',
    status: 'TRADING',
    baseAsset: 'RPX',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'RPX-ETH'
  },
  RPXBNB: {
    symbol: 'RPXBNB',
    status: 'TRADING',
    baseAsset: 'RPX',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'RPX-BNB'
  },
  NCASHBTC: {
    symbol: 'NCASHBTC',
    status: 'TRADING',
    baseAsset: 'NCASH',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'NCASH-BTC'
  },
  NCASHETH: {
    symbol: 'NCASHETH',
    status: 'TRADING',
    baseAsset: 'NCASH',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'NCASH-ETH'
  },
  NCASHBNB: {
    symbol: 'NCASHBNB',
    status: 'TRADING',
    baseAsset: 'NCASH',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'NCASH-BNB'
  },
  POABTC: {
    symbol: 'POABTC',
    status: 'TRADING',
    baseAsset: 'POA',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'POA-BTC'
  },
  POAETH: {
    symbol: 'POAETH',
    status: 'TRADING',
    baseAsset: 'POA',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'POA-ETH'
  },
  POABNB: {
    symbol: 'POABNB',
    status: 'TRADING',
    baseAsset: 'POA',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'POA-BNB'
  },
  ZILBTC: {
    symbol: 'ZILBTC',
    status: 'TRADING',
    baseAsset: 'ZIL',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'ZIL-BTC'
  },
  ZILETH: {
    symbol: 'ZILETH',
    status: 'TRADING',
    baseAsset: 'ZIL',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'ZIL-ETH'
  },
  ZILBNB: {
    symbol: 'ZILBNB',
    status: 'TRADING',
    baseAsset: 'ZIL',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'ZIL-BNB'
  },
  ONTBTC: {
    symbol: 'ONTBTC',
    status: 'TRADING',
    baseAsset: 'ONT',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'ONT-BTC'
  },
  ONTETH: {
    symbol: 'ONTETH',
    status: 'TRADING',
    baseAsset: 'ONT',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'ONT-ETH'
  },
  ONTBNB: {
    symbol: 'ONTBNB',
    status: 'TRADING',
    baseAsset: 'ONT',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'ONT-BNB'
  },
  STORMBTC: {
    symbol: 'STORMBTC',
    status: 'TRADING',
    baseAsset: 'STORM',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'STORM-BTC'
  },
  STORMETH: {
    symbol: 'STORMETH',
    status: 'TRADING',
    baseAsset: 'STORM',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'STORM-ETH'
  },
  STORMBNB: {
    symbol: 'STORMBNB',
    status: 'TRADING',
    baseAsset: 'STORM',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'STORM-BNB'
  },
  QTUMBNB: {
    symbol: 'QTUMBNB',
    status: 'TRADING',
    baseAsset: 'QTUM',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'QTUM-BNB'
  },
  QTUMUSDT: {
    symbol: 'QTUMUSDT',
    status: 'TRADING',
    baseAsset: 'QTUM',
    baseAssetPrecision: 8,
    quoteAsset: 'USDT',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00100000',
        maxPrice: '10000000.00000000',
        tickSize: '0.00100000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.00100000',
        maxQty: '10000000.00000000',
        stepSize: '0.00100000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '10.00000000'
      }
    ],
    pair: 'QTUM-USDT'
  },
  XEMBTC: {
    symbol: 'XEMBTC',
    status: 'TRADING',
    baseAsset: 'XEM',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'XEM-BTC'
  },
  XEMETH: {
    symbol: 'XEMETH',
    status: 'TRADING',
    baseAsset: 'XEM',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'XEM-ETH'
  },
  XEMBNB: {
    symbol: 'XEMBNB',
    status: 'TRADING',
    baseAsset: 'XEM',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'XEM-BNB'
  },
  WANBTC: {
    symbol: 'WANBTC',
    status: 'TRADING',
    baseAsset: 'WAN',
    baseAssetPrecision: 8,
    quoteAsset: 'BTC',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.00100000'
      }
    ],
    pair: 'WAN-BTC'
  },
  WANETH: {
    symbol: 'WANETH',
    status: 'TRADING',
    baseAsset: 'WAN',
    baseAssetPrecision: 8,
    quoteAsset: 'ETH',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00000001',
        maxPrice: '100000.00000000',
        tickSize: '0.00000001'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '1.00000000',
        maxQty: '90000000.00000000',
        stepSize: '1.00000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '0.01000000'
      }
    ],
    pair: 'WAN-ETH'
  },
  WANBNB: {
    symbol: 'WANBNB',
    status: 'TRADING',
    baseAsset: 'WAN',
    baseAssetPrecision: 8,
    quoteAsset: 'BNB',
    quotePrecision: 8,
    orderTypes: [
      'LIMIT',
      'LIMIT_MAKER',
      'MARKET',
      'STOP_LOSS_LIMIT',
      'TAKE_PROFIT_LIMIT'
    ],
    icebergAllowed: true,
    filters: [
      {
        filterType: 'PRICE_FILTER',
        minPrice: '0.00001000',
        maxPrice: '10000.00000000',
        tickSize: '0.00001000'
      },
      {
        filterType: 'LOT_SIZE',
        minQty: '0.01000000',
        maxQty: '10000000.00000000',
        stepSize: '0.01000000'
      },
      {
        filterType: 'MIN_NOTIONAL',
        minNotional: '1.00000000'
      }
    ],
    pair: 'WAN-BNB'
  }
};

// const wsMap = {
//   e: 'eventType,
//   E: 'eventTime,
//   s: 'symbol,
//   p: 'priceChange,
//   P: 'percentChange',
//   w: 'averagePrice',
//   x: prevClose,
//   c: close,
//   Q: closeQty,
//   b: bestBid,
//   B: bestBidQty,
//   a: bestAsk,
//   A: bestAskQty,
//   o: open,
//   h: high,
//   l: low,
//   v: volume,
//   q: quoteVolume,
//   O: openTime,
//   C: closeTime,
//   F: firstTradeId,
//   L: lastTradeId,
//   n: numTrades };


module.exports = { pairMap, pairInfo };
