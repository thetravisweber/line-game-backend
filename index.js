const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 7071 });

const clients = new Map();

let price = 100;

wss.on('connection', (ws) => {
  const id = uuidv4();
  const ownerShips = [];
  const score = 0;
  const metadata = { id, ownerShips, score };

  clients.set(ws, metadata);

  console.log("connection opened");

  ws.on('message', (message) => {
    const metadata = clients.get(ws);
    const sender = metadata.id;

    if (message == "b") {
      metadata.ownerShips.push(price);
      price+=10;
    } else if (message == "s") {
      if (metadata.ownerShips.length == 0) {
        return;
      }
      metadata.ownerShips = averageOwnerships(metadata.ownerShips);
      metadata.score += price - metadata.ownerShips[0];
      // remove 1 positon
      metadata.ownerShips.splice(0, 1);
      price-=10;
    }

    clients.set(ws, metadata);

    returnData = {
      "p": price,
      "l": metadata.score
    };

    console.log(JSON.stringify(returnData));
    [...clients.keys()].forEach((client) => {
      client.send(
        JSON.stringify(returnData)
      );
    });
  });

  ws.on("close", () => {
    clients.delete(ws);
    console.log("connection closed");
  });
});

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