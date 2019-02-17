let canvas = document.getElementById('canvas');
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
console.log("width = " + canvas.width);
console.log("height = " + canvas.height);
let game = new RpgGame(canvas);
game.addTilemap(
  "terrain",
  "http://localhost:8000/src/assets/tilemaps/terrain/terrain.png",
  "http://localhost:8000/src/assets/tilemaps/terrain/terrain.json"
);
game.addMap("town", "http://localhost:8000/src/assets/maps/town_map.json");

// Key Handlers
game.addKeyHandler('37', (game) => {
  console.log("PRESSED LEFT KEY");
});

game.addKeyHandler('39', (game) => {
  console.log("PRESSED RIGHT KEY");
});

let render = (ctx, game) => {
  ctx.fillStyle = "rgb(175, 175, 175)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  game.renderMapAt("town", 0, 0);
}
game.setRenderFn(render);

// initialize game
//game.setTileMapPosition(0, 0);

game.startGameLoop();
