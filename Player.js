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
    console.log("collecting on " + this.shorts.length + " shorts");
    this.shorts.forEach(short => {
      this.profit += short - currentPrice;
    });
    this.shorts = [];
    console.log(this.profit);
  }

  collectOnShares(currentPrice) {
    console.log("collecting on " + this.shares.length + " shares");
    this.shares.forEach(share => {
      this.profit += currentPrice - share;
    });
    this.shorts = [];
    console.log(this.profit);
  }

  notifyBoughtAt(price) {
    console.log(this.name, "bought");
    if (this.shorts.length != 0) {
      this.collectOnShorts(price);
    } else {
      this.shares.push(price);
    }
  }

  notifySoldAt(price) {
    console.log(this.name, "sold");
    if (this.shares.length != 0) {
      this.collectOnShares(price);
    } else {
      this.shorts.push(price);
    }
  }
}

function average(arr) {
  const ave = [...arr].reduce((a, b) => a + b) / arr.length;
  arr.fill(ave);
  return arr;
}

module.exports.Player = Player;