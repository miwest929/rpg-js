class RpgGame {
   constructor(canvas) {
     this.context = canvas.getContext('2d');
     this.renderFn = () => { console.log("render function not defined"); }
     this.preloadFn = () => {};
     this.preRenderFn = () => {};
     this.collisionFns = []; // array of functions

     this.assetManager = new AssetManager();

     this.tilemaps = {};
     this.maps = {};
     this.animations = {};

     this.keys = {};
     this.keyHandlers = {};

     this.tile_width = 16;
     this.tile_height = 16;
     this.screen_width_in_tiles = canvas.width / this.tile_width;
     this.screen_height_in_tiles = canvas.height / this.tile_height;

     this.map = null;
     this.camera = new MapCamera(0, 0, canvas.height, canvas.width);

     let _this = this;
     document.onkeydown = () => {
       _this.processKeyDownEvent();
     }
     document.onkeyup = () => {
       _this.processKeyUpEvent();
     }
   }

   processKeyDownEvent(e) {
     e = e || window.event;
     this.keys[e.keyCode] = true;
   }

   processKeyUpEvent(e) {
     e = e || window.event;
     this.keys[e.keyCode] = false;
   }

   setMap(mapKey, startRow, startCol) {
     this.map = this.maps[mapKey];
     this.map.row = startRow;
     this.map.col = startCol;
   }

   addTilemap(key, imgKey, jsonKey) {
     let img = this.assetManager.getImg(imgKey);
     let json = this.assetManager.getJson(jsonKey);
     this.tilemaps[key] = new TileMap(img, json);
   }

   addMap(key, jsonKey) {
     let json = this.assetManager.getJson(jsonKey);
     this.maps[key] = new Map(json, this.tilemaps);
   }

   addAnimation(key, animationTiles) {
     this.animations[key] = new Animation(animationTiles);
   }

   getAnimation(key) {
     return this.animations[key];
   }

   addKeyHandler(keyCode, handlerFn) {
     if (keyCode in this.keyHandlers) {
       this.keyHandlers[keyCode].append(handlerFn);
     } else {
       this.keyHandlers[keyCode] = [handlerFn];
     }
   }

   setRenderFn(renderFn) {
     this.renderFn = renderFn;
   }

   setPreRenderFn(preRenderFn) {
     this.preRenderFn = preRenderFn;
   }

   setPreloadFn(preloadFn) {
     this.preloadFn = preloadFn;
   }

   renderMapAt(mapKey, x, y) {
     let map = this.maps[mapKey];
     map.render(this.context, this.mapStartCol, this.mapStartRow, x, y);
   }

   handleKeyInput() {
     for (let keyCode in this.keys) {
       if (this.keys[keyCode]) {
         let handlers = this.keyHandlers[keyCode] || [];
         for (let i = 0; i < handlers.length; i++) {
           handlers[i](this);
         }
       }
     }
   }

   addCollisionFn(collisionFn) {
     this.collisionFns.push(collisionFn);
   }

   performCollisionDetection() {
     for (let i = 0; i < this.collisionFns.length; i++) {
       this.collisionFns[i](this);
     }
   }

   startGameLoop() {
     let gameloop = () => {
       this.preRenderFn();
       this.renderFn(this.context, this);
       this.handleKeyInput();
       this.performCollisionDetection();

       window.requestAnimationFrame(gameloop);
     }

     this.preloadFn(this);
     gameloop();
   }
}
