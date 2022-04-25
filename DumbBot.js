const Player = require('./Player.js');

class DumbBot extends Player {
  constructor() {
    super(genName());
    this.actionBias = Math.random(.02, .2);
    this.buyBias = Math.random(.35, .65);
  }

  makeAMove() {
    if (Math.random() < this.actionBias) return '';
    if (Math.random() < this.buyBias) return "b";
    return "s"
  }
}

function genName() {
  return 'steve';
}

module.exports = DumbBot;