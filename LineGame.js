const gl = require('node-gameloop');
const NO_GAME_LOOP = -101;
class LineGame {
  price = 100;
  gameloopId = NO_GAME_LOOP;

  constructor() {
    console.log("Line Game Created");
    console.log(this.price);
    this.gameloopId = gl.setGameLoop(
      (delta) => {this.loop(delta)},
      1000 * 3
    );
  }

  // delta is time difference since last loop
  loop(delta) {
    console.log("hello,",delta, this.price);
  }
}

module.exports.LineGame = LineGame;