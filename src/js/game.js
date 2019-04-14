class RpgGame {
   constructor(canvas, flags) {
     this.context = canvas.getContext('2d');

     /*
       shouldRenderCollisions (debugging) -> render colliding bounding boxes as red rectangles
     */
     this.flags = flags;


     this.renderFn = () => { console.log("render function not defined"); }
     this.preloadFn = () => {};
     this.preRenderFn = () => {};
     this.collisionFns = []; // array of dictionaries. Each dict has conditionFn, conclusionFn

     this.assetManager = new AssetManager("http://localhost:8000");

     this.tilemaps = {};
     this.maps = {};
     this.animations = {};

     // the held-down state for all keys
     this.keys = {};

     // triggered when a key is being held down
     this.keyHandlers = {};

     // triggered when a key press is released
     this.keyUpHandlers = {};

     this.tile_width = 16;
     this.tile_height = 16;
     this.screen_width_in_tiles = canvas.width / this.tile_width;
     this.screen_height_in_tiles = canvas.height / this.tile_height;

     // the current map that should be rendered
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

     if (this.keys[e.keyCode]) {
       this.triggerOnKeyUpHandlers(e.keyCode);
     }

     this.keys[e.keyCode] = false;
   }

   triggerOnKeyUpHandlers(keyCode) {
     let handlers = this.keyUpHandlers[keyCode] || [];
     for (let i = 0; i < handlers.length; i++) {
        handlers[i](this);
     }
   }

   addOnKeyUpHandler(keyCode, keyUpFn) {
     this.keyUpHandlers[keyCode] = keyUpFn;
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

     return this.maps[key];
   }

   addLayerToMap(key, jsonKey) {
     let json = this.assetManager.getJson(jsonKey);
     let map = this.maps[key];
     map.addLayer(json);

     return map;
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

   addCollisionFn(conditionFn, collisionFn) {
     this.collisionFns.push({"conditionFn": conditionFn, "collisionFn": collisionFn});
   }

   performCollisionDetection() {
     for (let i = 0; i < this.collisionFns.length; i++) {
       let collision = this.collisionFns[i];
       if (collision.conditionFn && collision.conditionFn(this)) {
         collision.collisionFn(this);
       }
     }
   }

   hasCollisionDetected(bb) {
     //let collision = this.map.isBlocked(bb);
     let otherBb = this.map.blockingBox(bb);
     if (this.flags.shouldRenderCollisions && otherBb) {
       this.context.fillStyle = "rgb(255, 0, 0)";
       this.context.fillRect(otherBb.x, otherBb.y, otherBb.width, otherBb.height);
     }

     return otherBb !== null;
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
