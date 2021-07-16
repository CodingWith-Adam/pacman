import TileMap from "./TileMap.js";

const tileSize = 32;
const velocity = 2;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileMap = new TileMap(tileSize);
const pacman = tileMap.getPacman(velocity);
const enemies = tileMap.getEnemies(velocity);

function gameLoop() {
  tileMap.draw(ctx);
  pacman.draw(ctx);
  enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));
}

function pause() {
  return !pacman.madeFirstMove;
}

tileMap.setCanvasSize(canvas);
setInterval(gameLoop, 1000 / 75);
