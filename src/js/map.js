class Map {
  constructor(json, tilemaps) {
    this.map = json;
    this.row = 0;
    this.col = 0;
    this.tilemaps = tilemaps;
  }

  scrollLeft() {
    this.col -= 2;
  }

  scrollRight() {
    this.col += 2;
  }

  scrollUp() {
    this.row -= 2;
  }

  scrollDown() {
    this.row -= 2;
  }

  render(ctx) {
    let tilemap = this.tilemaps[this.map.tilemap_key];
    let currX = 0;
    let currY = 0;
    let tile_width = 16;
    let tile_height = 16;

    for (let r = this.row; r < this.map.data.length; r++) {
      for (let c = this.col; c < this.map.data[r].length; c++, currX += tile_width) {
        tilemap.renderTile(ctx, this.map.data[r][c], currX, currY);
      }

      currX = 0;
      currY += tile_height;
    }
  }
}
