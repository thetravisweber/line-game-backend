// include files
const lg = require("./LineGame.js");
const gc = require("./GameController.js");

// initialize classes
const game = new lg.LineGame();
const controller = new gc.GameController();

// let reference each other
game.setController(controller);
controller.setGame(game);