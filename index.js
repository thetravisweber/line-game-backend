// include needed files
const WebSocket = require('ws');
const gl = require("./gameLoop.js");
const singletons = require("./singletons.js");
const webSocketConfig = require("./webSocketConfigurator.js");

// declare constants
const wss = new WebSocket.Server({ port: process.env.PORT || 5000 });
const coolDown = 700;

// initialize global variables
let price = 100;
let frameCount = 0;

// start game loop on server start
gl.start(loop);
webSocketConfig.setup(wss);

// set up websocket

// delta is time difference since last loop
function loop(delta) {
  frameCount++;
  console.log("hello,",delta, price);
}

function scoreUpdate(ws, metadata) {
  clients.set(ws, metadata);

  response = generalResponse(metadata);

  blast(response);
}

function generalResponse(metadata) {
  const leaderboard = calculateLeaderboard()

  return {
    "p": price,
    "s": metadata.score,
    "l": leaderboard
  };
}

function blast(data) {
  [...clients.keys()].forEach((client) => {
    client.send(
      JSON.stringify(data)
    );
  });
}

function calculateLeaderboard() {
  return [...clients.values()].map((client) => {
    return {
      "n": client.name,
      "s": client.score
    };
  });
}

function averageOwnerships(ownerShips) {
  const average = [...ownerShips].reduce((a, b) => a + b) / ownerShips.length;
  ownerShips.fill(average);
  return ownerShips;
}

console.log("wss up");