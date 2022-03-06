const WebSocket = require('ws');
class GameController {
  wss = new WebSocket.Server({ port: process.env.PORT || 5000 });
  clients = new Map();
  game;

  constructor() {
    console.log("Game Controller Created");
    this.setup();
  }

  setGame(_game) {
    this.game = _game;
  }
  
  setup() {
    this.wss.on('connection', (ws) => {
      const id = this.uuidv4();
      const metadata = { id};
    
      this.clients.set(ws, metadata);

      console.log("connection opened");
    
      ws.on('message', (m) => {this.receivedMessage(m, ws)});
    
      ws.on("close", () => {
        this.clients.delete(ws);
        console.log("connection closed");
      });
    });

    console.log("wss up");
  }

  receivedMessage(message, ws) {
    console.log("message received");
    const metadata = this.clients.get(ws);
    const id = metadata.id;
    
    if (message == "b") {
      this.game.playerWantsToBuy(id);
      return;
    } else if (message == "s") {
      this.game.playerWantsToSellShort(id);
      return;
    }

    const parsed = JSON.parse(message);
    if (!!parsed.name) {
      let added = this.game.addPlayer(id, parsed.name);
      if (added) {
        let leaderBoard = this.game.leaderBoard();
        ws.send(
          JSON.stringify(
            {
              "n": parsed.name,
              "l": leaderBoard
            }
          )
        );
      }
    }
  }

  blast(data) {
    [...this.clients.keys()].forEach((client) => {
      client.send(
        JSON.stringify(data)
      );
    });
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}


module.exports.GameController = GameController;
