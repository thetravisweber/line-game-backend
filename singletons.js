const lg = require('./LineGame.js');

const clientsMap = new Map();
const MainGame = new lg.LineGame();

module.exports = {
  clients: clientsMap,
  mainGame: MainGame
}