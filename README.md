# exchanges
## 虚拟币交易所集成

#### api比较
| 名称 | 方法  |  kucoin  | binance | bitfinex |
| --------   | -----:  |   -----:  |  :----: | --------   |
| 订单表(orderBook) | orders | ✅ |  |  |
| tick数据 | ticks | ✅ |  |  |
| k线图 | kline | ✅ |  |  |
| 币种信息(转账资费、最小转账等币种在交易所的相关信息) |coin | ✅ |  |  |
| 所有币种信息 | coins | ✅ | |  |
| 账户余额 | balances | ✅ | |  |
| 下单 | order | ✅ | |  |
| 订单详情 | orderInfo | ✅ | |  |
|  | | ✅ | |  |


#### 标准参数
| 名称 | 含义  | 备注  |
| --------   | -----:  | -----  |
| coin | 币种 |  |
| pair | 交易对 | 币币之间交易的交易对，又称symbol，格式如 ETH-BTC|
| exchange | 交易所 | |
| from| 开始时间| 单位为毫秒 |
| to| 结束时间| 单位为毫秒 |
| balance| 余额| 余额，某种币种的账户剩余量 |
| order| 订单|  |
| orderid | 订单id |  |
| | |  |

 