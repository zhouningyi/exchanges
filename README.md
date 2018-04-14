# exchanges
## 虚拟币交易所集成

#### api比较
| 名称 | 方法  | 输入 | 输出 |kucoin  | [binance](https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md) | [hitBTC](https://github.com/hitbtc-com/hitbtc-api/blob/master/APIv1.md) | [okex](https://github.com/okcoin-okex/OKEx.com-api-docs) | [bithumb](https://www.bithumb.com/u1/US127) |
| --------   | -----:  |-----:  |   :-----  |-----:  |  :----: | --------   | --------   | --------   |
| [市场(现货)](#市场类) |  |  |  | |  |  |  |  |
| [订单表(orderBook)](#订单表(orderBook)) | orderBook |  || ✅ | ✅ ||  |  |
| [tick数据（可以返回全量ticks, 也可以返回单个tick）](#ticks(全量tick数据)) | ticks |  |  | ✅ |✅||  | ✅ |
| tick数据(ws版) | wsTicks | | (注意输入的不是全量数据，是变化量) |  |✅|| |  |
| 市场(期货) |  | |  | ||| | |
| tick数据(只能按照单个pair返回) | tick(futureTick) | | |  ||| ✅ |  |
| 期货tick数据(ws版) | wsFutureTicks | | | |||  | |
| k线图 | kline / candlestick |  |  | ✅ |✅  可选范围 1m  3m  5m  15m  30m  1h  2h  4h  6h  8h  12h  1d  3d  1w  1M||  |  |
| 币种信息(转账资费、最小转账等币种在交易所的相关信息) |coin |  |  | ✅ |||  |  |
| 所有币种信息 | coins |  | | ✅ ||✅|  |  |
| 账户余额 | balances |  | | ✅ |||  |  |
| 下单 | order |  | | ✅ |||  |  |
| 订单详情 | orderInfo | side pair  orderId | pendingAmount  未完成数量dealAmount 完成数量 | ✅ |||  |  |
| 近期所有订单 | allOrders |  |  |  ||| ✅ | |
| 正在执行中的订单 | activeOrders |  |  | ✅ |✅|| ✅ |  |
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
| orderId | 订单id |  |
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

 ## 市场类

市场信息类，不用 appKey / appSecret 即可运行



#### 订单表(orderBook)


#### ticks(全量tick数据)
<details>
<summary>输入</summary>
```js
{
    pair: 'ETH-BTC'//可选，如果为空，默认返回所有pair的数据
}
```
</details>

<details>
<summary>输出</summary>
```js
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
```
</details>



