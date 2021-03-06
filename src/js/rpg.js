let canvas = document.getElementById('canvas');
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

SPACE_KEY = '32';
LEFT_KEY = '37';
UP_KEY = '38';
RIGHT_KEY = '39';
DOWN_KEY = '40';
A_BUTTON = '65';

let flags = {
  shouldRenderCollisions: true
};

let changeResolution = (canvas, scaleFactor) => {
    // Set up CSS size.
    canvas.style.width = canvas.style.width || canvas.width + 'px';
    canvas.style.height = canvas.style.height || canvas.height + 'px';

    // Resize canvas and scale future draws.
    canvas.width = Math.ceil(canvas.width * scaleFactor);
    canvas.height = Math.ceil(canvas.height * scaleFactor);
    var ctx = canvas.getContext('2d');
    ctx.scale(scaleFactor, scaleFactor);
}

//changeResolution(canvas, 1);

let prevTime = performance.now();
let computeFps = (currentTime) => {
  let fpsAsFloat = 1000 / (currentTime - prevTime);
  return Math.trunc(fpsAsFloat + 0.5);
};

let game = new RpgGame(canvas, flags);

assets = [
  "/src/assets/tilemaps/terrain/terrain.png",
  "/src/assets/tilemaps/player/player.png",
  "/src/assets/tilemaps/outside/outside.png",
  "/src/assets/tilemaps/terrain/terrain.json",
  "/src/assets/tilemaps/player/player.json",
  "/src/assets/tilemaps/outside/outside.json",
  "/src/assets/tilemaps/house/house.png",
  "/src/assets/tilemaps/house/house.json",
  "/src/assets/maps/overworld/overworld_base.json",
  "/src/assets/maps/overworld/overworld_layer1.json"
];
for (let i = 0; i < assets.length; i++) {
  game.assetManager.queueAsset(assets[i]);
}

game.assetManager.setAssetsLoadedFn(() => {

  game.addTilemap('terrain', 'terrain.png', 'terrain.json');
  game.addTilemap('player', 'player.png', 'player.json');
  game.addTilemap('outside', 'outside.png', 'outside.json');
  game.addTilemap('house', 'house.png', 'house.json');

  game.addMap('overworld', 'overworld_base.json');
  game.addLayerToMap('overworld', 'overworld_layer1.json');

  game.addKeyHandler(LEFT_KEY, (FACING_LEFT) => {
    if (!game.hasCollisionDetected(player.nextBoundingBox())) {
      player.moveLeft(game);
    }
  });
  game.addKeyHandler(RIGHT_KEY, () => {
    if (!game.hasCollisionDetected(player.nextBoundingBox(FACING_RIGHT))) {
      player.moveRight(game);
    }
  });
  game.addKeyHandler(UP_KEY, () => {
    if (!game.hasCollisionDetected(player.nextBoundingBox(FACING_UP))) {
      player.moveUp(game);
    }
  });
  game.addKeyHandler(DOWN_KEY, () => {
    if (!game.hasCollisionDetected(player.nextBoundingBox(FACING_DOWN))) {
      player.moveDown(game);
    }
  });

  game.addKeyHandler(A_BUTTON, () => {
    player.goRun();
  });

  game.addOnKeyUpHandler(A_BUTTON, () => {
    player.goWalk();
  });

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
    player.render(ctx, game.camera);
  });

  let t = game.tilemaps["player"].tiles;
  game.addAnimation("playerMoveUp", [t["8"], t["9"], t["10"], t["11"]]);
  game.addAnimation("playerMoveDown", [t["4"], t["5"], t["6"], t["7"]]);
  game.addAnimation("playerMoveLeft", [t["0"], t["1"], t["2"], t["3"]]);
  game.addAnimation("playerMoveRight", [t["12"], t["13"], t["14"], t["15"]]);

  player = new Player(game, 700, 250);

  game.addCollisionFn(() => { return game.camera.withinLeftEdge(player.x, 16) }, () => { game.camera.moveLeftBy(32) });
  game.addCollisionFn(() => { return game.camera.withinRightEdge(player.x, 16) }, () => { game.camera.moveRightBy(32) });
  game.addCollisionFn(() => { return game.camera.withinTopEdge(player.y, 16) }, () => { game.camera.moveUpBy(32) });
  game.addCollisionFn(() => { return game.camera.withinBottomEdge(player.y, 16) }, () => { game.camera.moveDownBy(32) });

  game.setMap("overworld", 0, 0);

  game.startGameLoop();
});

game.assetManager.loadAssets();
