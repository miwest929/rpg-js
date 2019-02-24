class Map {
  constructor(json, tilemaps) {
    this.map = json;
    this.tilemaps = tilemaps;
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
