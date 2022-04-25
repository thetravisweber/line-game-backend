const gl = require('node-gameloop');
const Player = require('./Player.js');
const NO_GAME_LOOP = -101;
// in dollars per second
const PRICE_CHANGE_RATE = 5;
const MILLISECONDS_PER_SECOND = 1000;
class LineGame {
  controller;
  frameRate = 30;
  price = 100;
  gameloopId = NO_GAME_LOOP;
  players = new Map();
  bots = [];
  buyOrders = [];
  sellOrders = [];
  

  constructor() {
    console.log("Line Game Created");
  }

  setController(_cont) {
    this.controller = _cont;
  }

  addPlayer(id, name) {
    this.players.set(id, new Player(name));
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
    this.placeBotOrders();
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

  adjustPrice(shares, timeDelta)
  {  
    this.price += PRICE_CHANGE_RATE * shares * timeDelta;
  }

  placeBotOrders(){
    this.bots.forEach((bot, index) => {
      let order = bot.makeAMove(this.price);
      if (order == 'b') {
        this.playerWantsToBuy(index);
      } else if (order == 's') {
        this.playerWantsToSellShort(index);
      }
    })
  }

  executeMarket() {
    let smallest = Math.min(this.buyOrders.length, this.sellOrders.length);
    for (let i = 0; i < smallest; i++) {
      let buyerId = this.buyOrders[i].id;
      let sellerId = this.sellOrders[i].id;
      if (buyerId == sellerId) {
        this.cancelOrders(i);
        continue;
      }
      let buyer = this.players.get(buyerId);
      let seller = this.players.get(sellerId);
      
      if (!!buyer) buyer.notifyBoughtAt(this.price);
      if (!!seller) seller.notifySoldAt(this.price);
    }
    this.removeOrders(smallest);
  }

  cancelOrders(orderIndex) {
    let timeDelay = this.timeBetweenOrders(
      this.buyOrders[orderIndex],
      this.sellOrders[orderIndex]
    );
    this.adjustPrice(1, timeDelay);
  }

  removeOrders(maxElement) {
    this.buyOrders.splice(0, maxElement);
    this.sellOrders.splice(0, maxElement);
  }

  playerWantsToBuy(id) {
    this.buyOrders.push(this.makeOrder(id));
  }

  playerWantsToSellShort(id) {
    this.sellOrders.push(this.makeOrder(id));
  }

  makeOrder(id) {
    return {
      "id": id,
      "time": Date.now()
    }
  }

  leaderBoard() {
    let leaderboard = [];
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

  timeBetweenOrders(buyOrder, sellOrder) {
    return (buyOrder.time-sellOrder.time) / MILLISECONDS_PER_SECOND;
  }

  addBot(bot) {
    this.bots.push(bot);
  }

  deleteABot() {
    if (this.bots.length == 0) return;
    this.bots.splice(0, 1);
  }
}

module.exports.LineGame = LineGame;