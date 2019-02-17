class Map {
  constructor(path, tilemaps) {
    this.loaded = false;
    this.map = {};
    this.tilemaps = tilemaps;
    this.loadJson(path, tilemaps);
  }

  loadJson(path) {
    $.getJSON(path, (json) => {
      this.map = json;
      this.loaded = true;
      console.log("json = " + path + " finished loading");
    });
  }

  render(ctx, startTileCol, startTileRow, x, y) {
    let tilemap = this.tilemaps[this.map.tilemap_key];
    let currX = x;
    let currY = y;
    let tile_width = 16;
    let tile_height = 16;

    for (let r = startTileRow; r < this.map.data.length; r++) {
      for (let c = startTileCol; c < this.map.data[r].length; c++, currX += tile_width) {
        tilemap.renderTile(ctx, this.map.data[r][c], currX, currY);
      }

      currX = x;
      currY += tile_height;
    }
  }
}
