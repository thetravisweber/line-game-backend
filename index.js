const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.PORT || 5000 });

const clients = new Map();

// in milliseconds
const coolDown = 5000;

let price = 100;

wss.on('connection', (ws) => {
  const id = uuidv4();
  const name = fakeName();
  const shares = [];
  const shorts = [];
  const score = 0;
  const lastMove = 0;
  const metadata = { id, name, shares, shorts, score, lastMove };

  clients.set(ws, metadata);

  console.log("connection opened");

  ws.on('message', (message) => {
    const metadata = clients.get(ws);

    let now = Date.now();
    if (now - coolDown < metadata.lastMove) {
      return;
    }
    metaData.lastMove = now;

    if (message == "b") {
      if (metadata.shorts.length == 0) {
        metadata.shares.push(price);
      } else {
        metadata.shorts = averageOwnerships(metadata.shorts);
        metadata.score += metadata.shorts[0] - price;
        // remove 1 positon
        metadata.shorts.splice(0, 1); 
      }
      price+=10;
      scoreUpdate(ws, metadata);
      return;
    } else if (message == "s") {
      if (metadata.shares.length == 0) {
        metadata.shorts.push(price);
      } else {
        metadata.shares = averageOwnerships(metadata.shares);
        metadata.score += price - metadata.shares[0];
        // remove 1 positon
        metadata.shares.splice(0, 1);
      }
      price-=10;
      scoreUpdate(ws, metadata);
      return;
    }

    const parsed = JSON.parse(message);
    if (!!parsed.name) {
      metadata.name = parsed.name;
      clients.set(ws, metadata);
      const resp = generalResponse(metadata);
      resp.n = metadata.name;
      ws.send(JSON.stringify(resp));
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    console.log("connection closed");
  });
});

function scoreUpdate(ws, metadata) {
  clients.set(ws, metadata);

  response = generalResponse(metadata);

  blast(response);
}

function generalResponse(metadata) {
  const leaderboard = calculateLeaderboard()

  return {
    "p": price,
    "s": metadata.score,
    "l": leaderboard
  };
}

function blast(data) {
  [...clients.keys()].forEach((client) => {
    client.send(
      JSON.stringify(data)
    );
  });
}

function calculateLeaderboard() {
  return [...clients.values()].map((client) => {
    return {
      "n": client.name,
      "s": client.score
    };
  });
}

function fakeName() {
  names = ["jake", "john", "jason", "james", "jose", "jorge", "justin", "jesus"];
  return names[Math.floor(Math.random() * names.length)];
}

function averageOwnerships(ownerShips) {
  const average = [...ownerShips].reduce((a, b) => a + b) / ownerShips.length;
  ownerShips.fill(average);
  return ownerShips;
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

console.log("wss up");