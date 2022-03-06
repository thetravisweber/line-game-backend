const gameloop = require('node-gameloop');
const NO_GAME_LOOP = -101;

let id = NO_GAME_LOOP;
let frameCount = 0;

module.exports = {
  id: id,
  frameCount: frameCount,
  start: function(loop, delay) {
    console.log("trying to start loop", id);
    if (id == NO_GAME_LOOP) {
      console.log("starting new loop");
      id = gameloop.setGameLoop((delta) => {
        loop(delta);
      }, delay);
    }
    return id;
  },
  end: function() {
    gameloop.clearGameLoop(id);
    id = NO_GAME_LOOP;
  }
}