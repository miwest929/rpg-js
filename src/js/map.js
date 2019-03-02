class MapCamera {
  constructor(positionRow, positionCol, fovHeight, fovWidth) {
    this.positionCol = positionCol;
    this.positionRow = positionRow;
    this.fovWidth = fovWidth;
    this.fovHeight = fovHeight;
  }
}

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

  render(ctx, camera) {
    let tilemap = this.tilemaps[this.map.tilemap_key];
    let currX = 0;
    let currY = 0;
    let tile_width = 16;
    let tile_height = 16;
    let mapHeight = Math.min(camera.fovHeight + camera.positionRow, this.map.data.length);

    for (let r = camera.positionRow; r < mapHeight; r++) {
      let mapWidth = Math.min(camera.fovWidth + camera.positionCol, this.map.data[r].length);
      for (let c = camera.positionCol; c < mapWidth; c++, currX += tile_width) {
        tilemap.renderTile(ctx, this.map.data[r][c], currX, currY);
      }

      currX = 0;
      currY += tile_height;
    }
  }
}
