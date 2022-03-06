const gl = require('node-gameloop');
const NO_GAME_LOOP = -101;
class LineGame {
  price = 100;
  gameloopId = NO_GAME_LOOP;
  players = {};

  constructor() {
    console.log("Line Game Created");
    this.startLoop();
  }

  addPlayer(id) {
    this.players[id] = {
      shares: [],
      shorts: [],
      profit: 0,
      lastMove: 0
    };
  }

  startLoop() {
    if (this.gameloopId != NO_GAME_LOOP) return;
    this.gameloopId = gl.setGameLoop(
      (delta) => {this.loop(delta)},
      1000 * 3
    );
  }

  endLoop() {
    if (this.gameloopId == NO_GAME_LOOP) return;
    gl.clearGameLoop(this.gameloopId);
  }

  // delta is time difference since last loop
  loop(delta) {
    console.log("hello,",delta, this.price);
  }
}

module.exports.LineGame = LineGame;