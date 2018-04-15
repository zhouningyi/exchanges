# exchanges
## 虚拟币交易所集成

#### api比较
| 名称 | 方法  | 输入 | 输出 |kucoin  | [binance](https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md) | [hitBTC](https://github.com/hitbtc-com/hitbtc-api/blob/master/APIv1.md) | [okex](https://github.com/okcoin-okex/OKEx.com-api-docs) | [bithumb](https://www.bithumb.com/u1/US127) |
| --------   | -----:  |-----:  |   :-----  |-----:  |  :----: | --------   | --------   | --------   |
| [市场(现货)](#市场类) |  |  |  | |  |  |  |  |
| [orderBook 订单表 ](#orderBook) | orderBook |  || ✅ | ✅ ||  |  |
| [ticks tick行情](#ticks) | ticks |  |  | ✅ |✅||  | ✅ |
| tick数据(ws版) | wsTicks | | (注意输入的不是全量数据，是变化量) |  |✅|| |  |
| 市场(期货) |  | |  | ||| | |
| tick数据(只能按照单个pair返回) | tick(futureTick) | | |  ||| ✅ |  |
| 期货tick数据(ws版) | wsFutureTicks | | | |||  | |
| k线图 | kline / candlestick |  |  | ✅ |✅  可选范围 1m  3m  5m  15m  30m  1h  2h  4h  6h  8h  12h  1d  3d  1w  1M||  |  |
| [wsFutureKlines(期货ws k线图)](#wsFutureKlines) | wsFutureKlines | | |  ||| ✅ | |
| 币种信息(转账资费、最小转账等币种在交易所的相关信息) |coin |  |  | ✅ |||  |  |
| 所有币种信息 | coins |  | | ✅ ||✅|  |  |
| 账户余额 | balances |  | | ✅ ||| ✅ |  |
| 期货账户余额 | futureBalances | | |  ||| ✅ | |
| 所有账户的余额 | allBalances | | |  ||| ✅ | |
| 账户资金划转 | moveBalance | | | |||  | |
| 下单 | order |  | | ✅ |||  |  |
| [orderInfo(订单详情)](#orderInfo) | orderInfo | side pair  order_id | pendingAmount  未完成数量dealAmount 完成数量 | ✅ |||  |  |
| 近期所有订单 | allOrders |  |  |  ||| ✅ | |
| 正在执行中的订单 | activeOrders |  |  | ✅ |✅|| ✅ |  |
| 已经完成的订单 | finishOrders | | |  ||| ✅ | |
| 测试连接 | ping | 无 | | |✅||  |  |
| 服务器时间 | time | 无 | | |✅||  |  |
| 交易对信息(偏静态) | pairs |  | | |✅||  |  |
| 深度信息 | depth(futureDepth) | pair | | |✅ limit 可选  5, 10, 20, 50, 100|| ✅ |  |
|  |  |  | | |||  |  |
|  |  |  | | |||  |  |
|  |  |  | | |||  |  |
|  |  |  | | |||  |  |
|  |  |  | | |||  |  |
|  |  |  | | |||  |  |





#### 交易所比较





#### 常见参数

| 名称 | 含义  | 备注  |
| --------   | -----:  | -----  |
| coin | 币种 |  |
| pair | 交易对 | 币币之间交易的交易对，又称symbol，格式如 ETH-BTC|
| exchange | 交易所 | |
| startTime| 开始时间| 单位为毫秒 |
| endTime| 结束时间| 单位为毫秒 |
| balance| 余额| 余额，某种币种的账户剩余量 |
| lockedBalance | 冻结余额 | 交易中被锁定的余额 |
| order_id | 订单id |  |
| order | 订单 |  |
| asks | 卖单 | |
| price | 交易价格 | |
| filters | 限制性条件 | |
|  |  | |
|  |  | |
|  |  | |
|  |  | |
|  |  | |
|  |  | |
|  |  | |


 ## 规范
1. 为了与数据库字段更好地对接，采用下划线命名变量
2. ​


 ## 市场类

市场信息类，不用 appKey / appSecret 即可运行


### orderBook 
订单表


### ticks
返回全量tick数据

<details>
<summary>输入配置(options)</summary>

```javascript
{
  pair: 'ETH-BTC'//可选，如果为空，默认返回所有pair的数据
}
```

</details>

<details>
<summary>输出</summary>

```javascript
//输入包含pair的情况:
  {
    "pair": "ZEC-USDT", // 交易对
    "last_price": 234, //最近一次交易价格
    "bid_price": 233.4432966,//合适的买价，如果卖则可以参考
    "ask_price": 236.49947969,//合适的卖价，如果买则可以参考
    "open_buy_orders": 266,//在线的买单数， 一些交易所没有
    "open_sell_orders": 547,//在线的卖单数 一些交易所没有
    "high": 242.34565446,//最高价(过去24h小时)
    "low": 212.00000009,//最低价(过去24h小时)
    "volume_24": 2548.18223815, //成交量(过去24小时)
    "time": "2018-04-13T19:15:53.933Z"//最后更新时间
  }
//不包含pair的情况:
 [
  {
    "pair": "ZEC-USDT", // 交易对
    "last_price": 234, //最近一次交易价格
    "bid_price": 233.4432966,//合适的买价，如果卖则可以参考
    "ask_price": 236.49947969,//合适的卖价，如果买则可以参考
    "open_buy_orders": 266,//在线的买单数， 一些交易所没有
    "open_sell_orders": 547,//在线的卖单数 一些交易所没有
    "high": 242.34565446,//最高价(过去24h小时)
    "low": 212.00000009,//最低价(过去24h小时)
    "volume_24": 2548.18223815, //成交量(过去24小时)
    "time": "2018-04-13T19:15:53.933Z"//最后更新时间
 }]
```

</details>


### wsFutureKlines
websocket 期货k线图, 可以返回所有交易对的信息，也可以只返回指定的pair

```javascript
//options: 配置
//cb: 回调函数
exchange.wsFutureKlines(options, cb);
```

#### 输入配置(options)

| 名称 | 意义 | 默认 | 必选  |
| --------   | -----:  | -----  | --------   |
| pair | 交易对 | 无(返回所有的kline数据) |  |
| contract_type | 合约类型: this_week:当周 next_week:下周 quarter:季度 | quarter |  |
|interval|时间窗口:1min/3min/5min/15min/30min/1day/3day/1week/1hour/2hour/4hour/6hour/12hour|1m||


<details>
<summary>输出</summary>

```javascript
 { 
   unique_id: 'BTC-USD_1523691240',
   pair: 'BTC-USD',
   time: '2018-04-14T07:34:00.000Z',
   open: 8267.75,
   high: 8267.76,
   low: 8246.75,
   close: 8250,
   volume_amount: 29668,//数量(张)
   volume_coin: 359.375501249285 //数量(币)
 }
```
</details>


### futureKlines
期货k线图,  功能如 [wsFutureKlines](#wsFutureKlines)

```javascript
//options: 配置
//cb: 回调函数
await exchange.futureKlines(options, cb);
```

### orderInfo
订单详情
```javascript
await exchange.orderInfo({
    order_id: 'xxx',
    pair: 'BTC-USD'
});
```
| 名称 | 意义 | 默认 | 必选  |
| --------   | -----:  | -----  | --------   |
| pair | 交易对 |  | ✅ |
| order_id | 订单id |  | ✅ |

<details>
<summary>输出</summary>

```javascript
 { 
    "order_id": '11931810',
    "order_main_id": '11931810',
    "amount": 2,
    "price": 0.00017263,
    "status": "SUCCESS",// 'CANCEL', 'UNFINISH','c', 'SUCCESS','CANCELLING'
    "side": "SELL", //SELL | BUY
    "type": "MARKET", // MARKET | LIMIT
    "time": "2018-04-15T03:43:27.000Z"
 }
```
</details>


### cancelOrder

取消订单

```javascript
await exchange.cancelOrder({
    order_id: 'xxx',
    pair: 'BTC-USD'
});
```
<details>
<summary>输出</summary>

```javascript
{
  "success": [
    "12761945"
  ],
  "error": []
}
```
</details>