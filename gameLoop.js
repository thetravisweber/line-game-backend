const gameloop = require('node-gameloop');
const NO_GAME_LOOP = -101;

let id = NO_GAME_LOOP;

module.exports = {
  start: function(loop) {
    console.log("trying to start loop", id);
    if (id == NO_GAME_LOOP) {
      console.log("starting new loop");
      id = gameloop.setGameLoop(loop, 1000 * 3);
    }
    return id;
  },
  end: function() {
    gameloop.clearGameLoop(id);
    id = NO_GAME_LOOP;
  }
}