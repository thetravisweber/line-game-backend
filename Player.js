class Player {
  name;
  shares = [];
  shorts = [];
  profit = 0;
  lastMove = 0;

  constructor(_name) {
    this.name = _name;
    console.log("player made", this.name);
  }

  collectOnShorts(currentPrice) {
    this.shorts.forEach(short => {
      this.profit += short - currentPrice;
    });
    this.shorts = [];
  }

  notifyBoughtAt(price) {
    console.log(this.name, "bought");
  }

  notifySoldAt(price) {
    console.log(this.name, "sold");
  }
}

function average(arr) {
  const ave = [...arr].reduce((a, b) => a + b) / arr.length;
  arr.fill(ave);
  return arr;
}

module.exports.Player = Player;