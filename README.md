# exchanges
## 虚拟币交易所集成

#### api比较
| 名称 | 方法  | 输入 | 输出 |kucoin  | [binance](https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md) | [hitBTC](https://github.com/hitbtc-com/hitbtc-api/blob/master/APIv1.md) | [okex](https://github.com/okcoin-okex/OKEx.com-api-docs) | [bithumb](https://www.bithumb.com/u1/US127) |
| --------   | -----:  |-----:  |   :-----  |-----:  |  :----: | --------   | --------   | --------   |
| 市场(现货) |  |  |  | |  |  |  |  |
| 订单表(orderBook) | orderBook |  || ✅ | ✅ ||  |  |
| tick数据（可以返回全量ticks, 也可以返回单个tick） | ticks |  |  | ✅ |✅||  | ✅ |
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





#### 标准参数

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

 