let canvas = document.getElementById('canvas');
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
console.log("width = " + canvas.width);
console.log("height = " + canvas.height);

SPACE_KEY = '32';
LEFT_KEY = '37';
UP_KEY = '38';
RIGHT_KEY = '39';
DOWN_KEY = '40';

let game = new RpgGame(canvas);
game.addTilemap(
  "terrain",
  "http://localhost:8000/src/assets/tilemaps/terrain/terrain.png",
  "http://localhost:8000/src/assets/tilemaps/terrain/terrain.json"
);
game.addTilemap(
  "player",
  "http://localhost:8000/src/assets/tilemaps/player/player.png",
  "http://localhost:8000/src/assets/tilemaps/player/player.json"
);
game.addMap("town", "http://localhost:8000/src/assets/maps/town_map.json");

game.setPreloadFn((game) => {
  let pTiles = game.tilemaps["player"].tiles;
  game.addAnimation("playerMoveUp", [
    pTiles["8"], pTiles["9"], pTiles["10"], pTiles["11"]
  ]);
  game.addAnimation("playerMoveDown", [
    pTiles["4"], pTiles["5"], pTiles["6"], pTiles["7"]
  ]);
  game.addAnimation("playerMoveLeft", [
    pTiles["0"], pTiles["1"], pTiles["2"], pTiles["3"]
  ]);
  game.addAnimation("playerMoveRight", [
    pTiles["12"], pTiles["13"], pTiles["14"], pTiles["15"]
  ]);
});

player = new Player(700, 250);

// Key Handlers
game.addKeyHandler(LEFT_KEY, (game) => {
  let currMapCol = game.mapStartCol;
  if (currMapCol > 0) {
    currMapCol--;
  }
  game.setMapRenderCol(currMapCol);

  player.onKeyLeftArrow(game);
});

game.addKeyHandler(RIGHT_KEY, (game) => {
  let currMapCol = game.mapStartCol;
  currMapCol++;
  game.setMapRenderCol(currMapCol);

  player.onKeyRightArrow(game);
});

game.addKeyHandler(UP_KEY, (game) => {
  let currMapRow = game.mapStartRow;
  if (currMapRow > 0) {
    currMapRow--;
  }
  game.setMapRenderRow(currMapRow);

  player.onKeyUpArrow(game);
});

game.addKeyHandler(DOWN_KEY, (game) => {
  let currMapRow = game.mapStartRow;
  currMapRow++;
  game.setMapRenderRow(currMapRow);

  player.onKeyDownArrow(game);
});

let render = (ctx, game) => {
  ctx.fillStyle = "rgb(175, 175, 175)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  game.renderMapAt("town", 0, 0);
  player.render(game)
}
game.setRenderFn(render);

// initialize game
//game.setTileMapPosition(0, 0);

game.startGameLoop();
