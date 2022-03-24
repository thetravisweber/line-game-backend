const gl = require('node-gameloop');
const pl = require('./Player.js');
const NO_GAME_LOOP = -101;
class LineGame {
  controller;
  frameRate = 10;
  price = 100;
  gameloopId = NO_GAME_LOOP;
  players = new Map();
  buyOrders = [];
  sellOrders = [];

  constructor() {
    console.log("Line Game Created");
  }

  setController(_cont) {
    this.controller = _cont;
  }

  addPlayer(id, name) {
    this.players.set(id, new pl.Player(name));
    this.startLoop();
    return true;
  }

  startLoop() {
    if (this.gameloopId != NO_GAME_LOOP) return;
    this.gameloopId = gl.setGameLoop(
      (delta) => {this.loop(delta)},
      1000 / this.frameRate
    );
  }

  endLoop() {
    if (this.gameloopId == NO_GAME_LOOP) return;
    gl.clearGameLoop(this.gameloopId);
  }

  // delta is time difference since last loop
  loop(delta) {
    this.executeMarket();
    let difference = this.buyOrders.length - this.sellOrders.length;
    this.adjustPrice(difference, delta);
    this.controller.blast(
      {
        "p": this.price,
        "l": this.leaderBoard()
      }
    );
  }

  adjustPrice(shares, timeDelta) {
    this.price += 5 * shares * timeDelta;
  }

  executeMarket() {
    let smallest = Math.min(this.buyOrders.length, this.sellOrders.length);
    for (let i = 0; i < smallest; i++) {
      let buyerId = this.buyOrders[i].id;
      let sellerId = this.sellOrders[i].id;
      if (buyerId == sellerId) {
        this.adjustPrice(1, (this.buyOrders[i].time-this.sellOrders[i].time)/100);
        continue;
      }
      let buyer = this.players.get(buyerId);
      let seller = this.players.get(sellerId);
      
      if (!!buyer) buyer.notifyBoughtAt(this.price);
      if (!!seller) seller.notifySoldAt(this.price);
    }
    this.removeOrders(smallest);
  }

  removeOrders(maxElement) {
    this.buyOrders.splice(0, maxElement);
    this.sellOrders.splice(0, maxElement);
  }

  playerWantsToBuy(id) {
    this.buyOrders.push(
      {
        "id": id,
        "time": Math.round(Date.now()/10)
      }
    );
  }

  playerWantsToSellShort(id) {
    this.sellOrders.push(
      {
        "id": id,
        "time": Math.round(Date.now()/10)
      }
    );
  }

  leaderBoard() {
    let leaderboard = [];
    console.log(this.players);
    [...this.players.values()].forEach( player => {
      leaderboard.push(
        {
          "n": player.name,
          "s": player.profit
        }
      );
    });
    return leaderboard;
  }

  playerLeft(leavingPlayerId)
  {
    this.players.delete(leavingPlayerId);
  }
}

module.exports.LineGame = LineGame;