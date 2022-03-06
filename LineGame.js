class LineGame {
  constructor() {
    console.log("Line Game Created");
  }

  // delta is time difference since last loop
  loop(delta) {
    frameCount++;
    console.log("hello,",delta, price);
  }
}

module.exports.LineGame = LineGame;