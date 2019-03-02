class MapCamera {
  constructor(positionY, positionX, fovHeight, fovWidth) {
    this.positionY = positionY;
    this.positionX = positionX;
    this.fovWidth = fovWidth;
    this.fovHeight = fovHeight;
  }

  fromXtoCol(value, tileWidth) {
    return value / tileWidth;
  }

  fromYtoRow(value, tileHeight) {
    return value / tileHeight;
  }

  startingCol(tileWidth) {
    return this.fromXtoCol(this.positionX, tileWidth);
  }

  startingRow(tileHeight) {
    return this.fromYtoRow(this.positionY, tileHeight);
  }

  screenWidthInCol(tileWidth) {
    return this.fromXtoCol(this.fovWidth, tileWidth);
  }

  screenHeightInRow(tileHeight) {
    return this.fromYtoRow(this.fovHeight, tileHeight);
  }
}

class Map {
  constructor(json, tilemaps) {
    this.map = json;
    this.row = 0;
    this.col = 0;
    this.tilemaps = tilemaps;
  }

  render(ctx, camera) {
    let tilemap = this.tilemaps[this.map.tilemap_key];
    let currX = 0;
    let currY = 0;
    let tile_width = 16;
    let tile_height = 16;
    let mapHeight = Math.min(camera.screenHeightInRow(tile_height) + camera.startingRow(tile_height), this.map.data.length);

    for (let r = camera.startingRow(tile_height); r < mapHeight; r++) {
      let mapWidth = Math.min(camera.screenWidthInCol(tile_width) + camera.startingCol(tile_width), this.map.data[r].length);
      for (let c = camera.startingCol(tile_width); c < mapWidth; c++, currX += tile_width) {
        tilemap.renderTile(ctx, this.map.data[r][c], currX, currY);
      }

      currX = 0;
      currY += tile_height;
    }
  }
}
