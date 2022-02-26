const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 7071 });

const clients = new Map();

let price = 100;

wss.on('connection', (ws) => {
  const id = uuidv4();
  const metadata = { id };

  clients.set(ws, metadata);

  console.log("connection opened");

  ws.on('message', (message) => {
    const metadata = clients.get(ws);

    const sender = metadata.id;

    console.log(`${sender} is ${message}ing.`);

    if (message == "b") {
      price+=10;
    } else if (message == "s") {
      price-=10;
    }

    [...clients.keys()].forEach((client) => {
      client.send(price);
    });
  });

  ws.on("close", () => {
    clients.delete(ws);
    console.log("connection closed");
  });
});


function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
console.log("wss up");