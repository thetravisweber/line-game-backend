const gc = require("./GameController.js");
const lg = require("./LineGame.js");

module.exports = {
  controller: new gc.GameController(),
  game: new lg.LineGame()
}