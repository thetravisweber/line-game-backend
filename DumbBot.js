const Player = require('./Player.js');

class DumbBot extends Player {
  constructor() {
    super(genName());
    this.actionBias = .02;
  }

  makeAMove(price) {
    if (Math.random() < this.actionBias) {
      let odds_of_buying = 1 - (price / 200);
      if (Math.random() < odds_of_buying && this.canBuy(price)) return "b";
      if (this.canSell(price)) return "s"
    }
    return '';
  }

  canBuy(price) {
    return this.shares.length < 2;
  }

  canSell(price) {
    return this.shorts.length < 2;
  }
}

function genName() {
  return "anon#" + Math.floor(randomBetween(1000, 9999));
}

function randomBetween(start, end) {
  let range = end - start;
  let r = range * Math.random();
  return r + start;
}

module.exports = DumbBot;