class Player {
  name;
  shares = [];
  shorts = [];
  profit = 0;
  lastMove = 0;
  orders = 0;

  constructor(_name) {
    this.name = _name;
    console.log("player made", this.name);
  }

  addOrder() {
    this.orders++;
  }

  dropOrder() {
    this.orders--;
  }

  collectOnShares(currentPrice) {
    let share = this.shares[0];
    this.profit += currentPrice - share;
    this.shares.splice(0, 1);
  }

  collectOnShorts(currentPrice) {
    let short = this.shorts[0];
    this.profit += short - currentPrice;
    this.shorts.splice(0, 1);
  }

  notifyBoughtAt(price) {
    if (this.shorts.length > 0) {
      this.collectOnShorts(price);
    } else {
      this.shares.push(price);
    }
    this.dropOrder();
  }

  notifySoldAt(price) {
    if (this.shares.length != 0) {
      this.collectOnShares(price);
    } else {
      this.shorts.push(price);
    }
    this.addOrder();
  }

  getSummary() {
    return {
      own: this.shares.length - this.shorts.length,
      orders: this.orders
    };
  }
}

function average(arr) {
  const ave = [...arr].reduce((a, b) => a + b) / arr.length;
  arr.fill(ave);
  return arr;
}

module.exports = Player;