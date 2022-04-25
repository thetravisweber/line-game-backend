const WebSocket = require('ws');
const DumbBot = require('./DumbBot.js');
class GameController {  
  wss = new WebSocket.Server({ port: process.env.PORT || 5050 });
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
      const metadata = { id };
    
      this.clients.set(ws, metadata);

      console.log("connection opened");
    
      ws.on('message', (m) => {this.receivedMessage(m, ws)});
    
      ws.on("close", () => {
        const metadata = this.clients.get(ws);
        this.game.playerLeft(metadata.id);
        this.clients.delete(ws);
        console.log("connection closed");
      });

      this.manageBots(this.clients.size);
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

  manageBots(numberOfPlayers) {
    if (numberOfPlayers == 1) {
      // create 5 bots
      for (let i = 0; i < 7; i++) {
        let bot = new DumbBot();
        this.game.addBot(bot);
      }
    }

    if (numberOfPlayers > 5) {
      // start deleting bots
      this.game.deleteABot();
    }
  }
}


module.exports.GameController = GameController;
