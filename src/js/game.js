class RpgGame {
   constructor(canvas) {
     this.context = canvas.getContext('2d');
     this.renderFn = () => { console.log("render function not defined"); }
     this.preloadFn = () => { };
     this.tilemaps = {};
     this.maps = {};
     this.keyHandlers = {};

     this.tile_width = 16;
     this.tile_height = 16;
     this.screen_width_in_tiles = canvas.width / this.tile_width;
     this.screen_height_in_tiles = canvas.height / this.tile_height;
     this.mapStartX = 0;
     this.mapStartY = 0;
   }

   addTilemap(key, tilemapImg, tilemapConfig) {
     this.tilemaps[key] = new TileMap(tilemapImg, tilemapConfig);
   }

   addMap(key, mapPath) {
     this.maps[key] = new Map(mapPath, this.tilemaps);
   }

   addKeyHandler(keyCode, handlerFn) {
     this.keyHandlers[keyCode] = handlerFn;
   }

   setRenderFn(renderFn) {
     this.renderFn = renderFn;
   }

   setPreloadFn(preloadFn) {
     this.preloadFn = preloadFn;
   }

   renderMapAt(mapKey, x, y) {
     let map = this.maps[mapKey];
     map.render(this.context, this.mapStartX, this.mapStartY, x, y);
   }

   isAssetsLoaded() {
     for (let key in this.tilemaps) {
       if (!this.tilemaps[key].loaded) {
         return false;
       }
     }

     for (let key in this.maps) {
       if (!this.maps[key].loaded) {
         return false;
       }
     }

     return true;
   }

   startGameLoop() {
     // first, wait for all assets to finish loading
//     while (!this.isAssetsLoaded()) {}
//     console.log("All assets have finished loading");
     let gameloop = () => {
       this.renderFn(this.context, this);
       window.requestAnimationFrame(gameloop);
     }

     this.preloadFn();
     setTimeout(gameloop, 2000);
   }
}
