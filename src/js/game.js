class RpgGame {
   constructor(canvas) {
     this.context = canvas.getContext('2d');
     this.renderFn = () => { console.log("render function not defined"); }
     this.preloadFn = () => {};
     this.loadingFn = () => {};

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
     this.mapStartCol = 0;
     this.mapStartRow = 0;

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

   setMapRenderRow(newRow) {
     this.mapStartRow = newRow;
   }

   setMapRenderCol(newCol) {
     this.mapStartCol = newCol;
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

   setLoadingFn(loadingFn) {
     this.loadingFn = loadingFn;
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

   startGameLoop() {
     let gameloop = () => {
       this.renderFn(this.context, this);
       this.handleKeyInput();
       window.requestAnimationFrame(gameloop);
     }

     this.preloadFn(this);
     gameloop();
   }
}
