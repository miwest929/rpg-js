let fromXtoCol = (value, tileWidth) => {
  return value / tileWidth;
}

let fromYtoRow = (value, tileHeight) => {
  return value / tileHeight;
}

let fromColToX = (value, tileWidth) => {
  return value * tileWidth;
}

let fromRowToY = (value, tileHeight) => {
  return value * tileHeight;
}

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



  startingCol(tileWidth) {
    return fromXtoCol(this.positionX, tileWidth);
  }

  startingRow(tileHeight) {
    return fromYtoRow(this.positionY, tileHeight);
  }

  screenWidthInCol(tileWidth) {
    return fromXtoCol(this.fovWidth, tileWidth);
  }

  screenHeightInRow(tileHeight) {
    return fromYtoRow(this.fovHeight, tileHeight);
  }
}

class Map {
  constructor(json, tilemaps) {
    this.map = json;
    this.layers = [];
    this.row = 0;
    this.col = 0;
    this.tilemaps = tilemaps;

    // array of BoundingBox
    this.collisions = [];
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
    for (let i = 0; i < layer.data.length; i++) {
      let tileMapKey = layer.data[i]["tilemapkey"];
      let tileKey = layer.data[i]["tilekey"];
      let units = layer.data[i]["units"];
      let x = layer.data[i]["x"];
      let y = layer.data[i]["y"];

      this.renderLayerTile(ctx, tileMapKey, tileKey, units, x, y);
    }
  }

  renderLayerTile(ctx, tileMapKey, tileKey, units, x, y) {
    let tilemap = this.tilemaps[tileMapKey];

    if (units == "tiles") {
      x = fromColToX(x, 16);
      y = fromRowToY(y, 16);
    }

    tilemap.renderTile(ctx, tileKey, x, y);
  }

  addCollisionBoundingBox(bb) {
    this.collisions.push(bb);
  }

  addLayer(layer) {
    this.layers.push(layer);
    for (let i = 0; i < layer.data.length; i++) {
      let obj = layer.data[i];
      let tilemap = this.tilemaps[obj.tilemapkey];
      let tile = tilemap.tiles[obj.tilekey];
      if (tile.collision) {
        let bb = this.makeTileBoundingBox(tile.collision, obj.x, obj.y, obj.units);
        this.addCollisionBoundingBox(bb);
      }
    }
  }

  makeTileBoundingBox(tmBb, x, y, units) {
    if (units == "tiles") {
      x = fromColToX(x, 16);
      y = fromRowToY(y, 16);
    }

    return new BoundingBox(
      tmBb.x + x, tmBb.y + y, tmBb.width, tmBb.height);
  }

  // debugging purposes only

  blockingBox(bb) {
    // check if supplied bounding box intersects with any of
    // the bounding boxes on the current map
    for (let i = 0; i < this.collisions.length; i++) {
      let otherBb = this.collisions[i];
      if (otherBb.intersects(bb)) {
        return otherBb;
      }
    }

    return null;
  }
}
