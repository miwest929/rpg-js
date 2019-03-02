let canvas = document.getElementById('canvas');
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

SPACE_KEY = '32';
LEFT_KEY = '37';
UP_KEY = '38';
RIGHT_KEY = '39';
DOWN_KEY = '40';

let prevTime = performance.now();
let computeFps = (currentTime) => {
  let fpsAsFloat = 1000 / (currentTime - prevTime);
  return Math.trunc(fpsAsFloat + 0.5);
};

let game = new RpgGame(canvas);
game.assetManager.queueImageAsset("http://localhost:8000/src/assets/tilemaps/terrain/terrain.png");
game.assetManager.queueImageAsset("http://localhost:8000/src/assets/tilemaps/player/player.png");
game.assetManager.queueJsonAsset("http://localhost:8000/src/assets/tilemaps/terrain/terrain.json");
game.assetManager.queueJsonAsset("http://localhost:8000/src/assets/tilemaps/player/player.json");
game.assetManager.queueJsonAsset("http://localhost:8000/src/assets/maps/town_map.json");

game.assetManager.setAssetsLoadedFn(() => {

  game.addTilemap('terrain', 'terrain.png', 'terrain.json');
  game.addTilemap('player', 'player.png', 'player.json');
  game.addMap('town', 'town_map.json');

  game.addKeyHandler(LEFT_KEY, () => {
    player.onKeyLeftArrow(game);
  });

  game.addKeyHandler(RIGHT_KEY, () => {
    player.onKeyRightArrow(game);
  });

  game.addKeyHandler(UP_KEY, () => {
    player.onKeyUpArrow(game);
  });

  game.addKeyHandler(DOWN_KEY, () => {
    player.onKeyDownArrow(game);
  });

  //game.addCollisionFn(() => { return game.camera.within(player.x, player.y, 2)) }, () => {
  //  game.camera.scrollLeftBy(1);
  //});

  game.setPreRenderFn(() => {
    let currentTime = performance.now();
    let fps = computeFps(currentTime);
    prevTime = currentTime;

    let fpsElement = document.getElementById("fps");
    fpsElement.innerHTML = `Frames Per Second = ${fps}`;
  });

  game.setRenderFn((ctx, game) => {
    ctx.fillStyle = "rgb(175, 175, 175)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    game.map.render(ctx, game.camera);
    player.render(ctx);
  });

  let t = game.tilemaps["player"].tiles;
  game.addAnimation("playerMoveUp", [t["8"], t["9"], t["10"], t["11"]]);
  game.addAnimation("playerMoveDown", [t["4"], t["5"], t["6"], t["7"]]);
  game.addAnimation("playerMoveLeft", [t["0"], t["1"], t["2"], t["3"]]);
  game.addAnimation("playerMoveRight", [t["12"], t["13"], t["14"], t["15"]]);

  player = new Player(game, 700, 250);

  game.setMap("town", 0, 0);

  game.startGameLoop();
});

game.assetManager.loadAssets();
