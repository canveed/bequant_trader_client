const call = (ws, { type, name, params }) => {
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  const method = type + capitalizedName; // Example of method: subscribeTicker
  const request = {
    method,
    params,
    id: 123
  };
  ws.send(JSON.stringify(request));
}

const ws = new WebSocket('wss://api.bequant.io/api/2/ws');

let lastSnapshot = {};
let lastOrdebook = {};
const limit = 20;

ws.onopen = () => {
  call(ws, {
    type: 'subscribe',
    name: 'orderbook',
    params: {
      symbol: 'ETHBTC',
    }
  });
};

const readyParams = (params) => {
  let { ask, bid } = params;
  params.ask = ask.slice(0, limit);
  params.bid = bid.slice(0, limit);
  return params;
}

ws.onmessage = (msg) => {
  const response = JSON.parse(msg.data);
  const { params, method } = response;

  switch (method) {
    case 'snapshotOrderbook':
      lastSnapshot = readyParams(params);
      console.log(lastSnapshot)
      break;
    case 'updateOrderbook':
      lastOrderbook = readyParams(params);
      break;
  }
};
