class MapCamera {
  constructor(positionY, positionX, fovHeight, fovWidth) {
    this.positionY = positionY;
    this.positionX = positionX;
    this.fovHeight = fovHeight;
    this.fovWidth = fovWidth;
  }

  moveLeftBy(leftOffset) {
    if (this.positionX >= leftOffset) {
      this.positionX -= leftOffset;
    }
  }

  moveRightBy(rightOffset) {
    this.positionX += rightOffset;
  }

  moveUpBy(upOffset) {
    if (this.positionY >= upOffset) {
      this.positionY -= upOffset;
    }
  }

  moveDownBy(downOffset) {
    this.positionY += downOffset;
  }

  withinLeftEdge(x, padding) {
    return x - padding < 0;
  }

  withinRightEdge(x, padding) {
    return x + this.positionX + padding >= (this.positionX + this.fovWidth);
  }

  withinTopEdge(y, padding) {
    return y - padding < 0;
  }

  withinBottomEdge(y, padding) {
    return y + this.positionY + padding >= (this.positionY + this.fovHeight);
  }

  fromXtoCol(value, tileWidth) {
    return value / tileWidth;
  }

  fromYtoRow(value, tileHeight) {
    return value / tileHeight;
  }

  fromColToX(value, tileWidth) {
    return value * tileWidth;
  }

  fromRowToY(value, tileHeight) {
    return value * tileHeight;
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
    this.layers = [];
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

    // render the remaining layers
    for (let i = 0; i < this.layers.length; i++) {
      this.renderLayer(ctx, camera, this.layers[i]);
    }
  }

  renderLayer(ctx, camera, layer) {
    let tilemap = this.tilemaps[layer.tilemap_key];

    for (let i = 0; i < layer.data.length; i++) {
      let tileId = layer.data[i][0];
      let row = layer.data[i][1];
      let col = layer.data[i][2];
      let x = camera.fromColToX(col, 16);
      let y = camera.fromRowToY(row, 16);
      tilemap.renderTile(ctx, tileId, x, y);
    }
  }

  addLayer(layer) {
    this.layers.push(layer);
  }
}
