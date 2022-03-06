const singletons = require("./singletons.js");

module.exports = {
  setup: function(wss) {
    wss.on('connection', (ws) => {
      const id = uuidv4();
      const name = "";
      const shares = [];
      const shorts = [];
      const score = 0;
      const lastMove = 0;
      const metadata = { id, name, shares, shorts, score, lastMove };
    
      singletons.clients.set(ws, metadata);
    
      console.log("connection opened");
    
      ws.on('message', (message) => {
        console.log("message received");
        const metadata = singletons.clients.get(ws);
        
        if (message == "b") {
          let now = Date.now();
          if (now - coolDown < metadata.lastMove) {
            return;
          }
          metadata.lastMove = now;
          if (price > 100) {
            metadata.score -= 10;
          } else if (price < 100) {
            metadata.score += 10;
          }
          price+=10;
          scoreUpdate(ws, metadata);
          return;
        } else if (message == "s") {
          let now = Date.now();
          if (now - coolDown < metadata.lastMove) {
            return;
          }
          metadata.lastMove = now;
          if (price > 100) {
            metadata.score += 10;
          } else if (price < 100) {
            metadata.score -= 10;
          }
          price-=10;
          scoreUpdate(ws, metadata);
          return;
        }
    
        const parsed = JSON.parse(message);
        if (!!parsed.name) {
          metadata.name = parsed.name;
          singletons.clients.set(ws, metadata);
          const resp = generalResponse(metadata);
          resp.n = metadata.name;
          ws.send(JSON.stringify(resp));
        }
      });
    
      ws.on("close", () => {
        singletons.clients.delete(ws);
        console.log("connection closed");
        console.log(gl.end());
      });
    });
  }
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}