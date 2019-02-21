# Bequant Trader Client
Trader based on Bequant Socket API

# Install
Clone the repo and locate to it, then run `index.html`

# Errors
Erros in Socket API of Bequant is the same as in REST API (See [Link](https://api.bequant.io/#errors))

# Requests
There are two channels available: `ticker` and `orderbook`
## Subscription/Unsubscribe
For subscribe, for example, to `orderbook`:
```
  call(ws, {
    type: 'subscribe',
    name: 'orderbook',
    params: {
      symbol: 'ETHBTC',
    }
  });
```
Function send accepts two params: ws and request.


### Template of `request` param:
```
type = (string) subscribe/unsubscribe
name = (string) name of request
params = {
  symbol = (string) currency pair
}
```
