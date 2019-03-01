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

let snapshot = {};
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

const removeNulls = (params, names) => {
  names.forEach((name) => {
    params[name].filter((item) => item.size != 0);
  })
  return (params);
};

const cutSnapshot = (params) => {
  return ({
    ...params,
    ask: params.ask.slice(0, limit),
    bid: params.bid.slice(0, limit),
  });
};

const prepaireSnapshot = (rawParams) => {
  const cuttedParams = cutSnapshot(rawParams);
  const params = removeNulls(cuttedParams, ['ask', 'bid']);
  return params;
}

const prepareOrderbook = (snapshot, data, names) => {
  let newSnapshot = {};
  names.forEach((name) => {

    let temp = snapshot[name].reduce((memo, i) => {
      memo[i.price] = i.size;
      return memo;
    }, {});

    data[name].forEach(item => {
      temp[item.price] = item.size;
    });

    newSnapshot[name] = Object.keys(temp).filter(k => temp[k] != 0).map(k => ({
      price: k,
      size: temp[k]
    }));

  });
  return removeNulls(newSnapshot, names);
};


ws.onmessage = (msg) => {
  const response = JSON.parse(msg.data);
  const { params, method } = response;

  switch (method) {
    case 'snapshotOrderbook':
      snapshot = prepaireSnapshot(params);
      console.log('after snapshotOrderbook', JSON.stringify(snapshot));
      break;
    case 'updateOrderbook':
      console.log(params);
      console.log('before prepareOrderbook', JSON.stringify(snapshot));
      snapshot = prepareOrderbook(snapshot, params, ['ask', 'bid']);
      console.log('after prepareOrderbook', JSON.stringify(snapshot));
      break;
  }
};
