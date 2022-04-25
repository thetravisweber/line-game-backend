const Player = require('./Player.js');

class DumbBot extends Player {
  constructor() {
    super(genName());
    this.actionBias = randomBetween(0.1, .1);
  }

  makeAMove(price) {
    if (Math.random() < this.actionBias) {
      if (Math.random() < 1 - (price / 200) && this.canBuy()) return "b";
      if (this.canSell()) return "s"
    }
    return '';
  }

  canBuy() {
    return this.shares.length < 2;
  }

  canSell() {
    return this.shorts.length < 2;
  }
}

function genName() {
  return 'steve';
}

function randomBetween(start, end) {
  let range = end - start;
  let r = range * Math.random();
  return r + start;
}

module.exports = DumbBot;