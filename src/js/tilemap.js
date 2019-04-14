class BoundingBox {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  offsetBy(deltaX, deltaY) {
    this.x += deltaX;
    this.y += deltaY;

    return this;
  }

  intersects(bb) {
    let xLeftOne = this.x;
    let xLeftTwo = bb.x;
    let xRightOne = this.x + this.width;
    let xRightTwo = bb.x + bb.width;

    let yTopOne = this.y;
    let yTopTwo = bb.y;
    let yBottomOne = this.y + this.height;
    let yBottomTwo = bb.y + bb.height;

    // a is left of b
    if (xRightOne < xLeftTwo) {
      return false;
    }

    // a is right of b
    if (xLeftOne > xRightTwo) {
      return false;
    }

    // a is above b
    if (yBottomOne < yTopTwo) {
      return false;
    }

    // a is below b
    if (yTopOne > yBottomTwo) {
      return false;
    }

    return true; // boxes overlap
  }
}

class Tile {
  constructor(srcImg, tileConfig) {
    this.img = srcImg;
    this.startx = tileConfig.startx;
    this.starty = tileConfig.starty;
    this.width = tileConfig.width;
    this.height = tileConfig.height;

    this.collision = null;
    if (tileConfig.collision) {
      this.collision = new BoundingBox(
        tileConfig.collision.x,
        tileConfig.collision.y,
        tileConfig.collision.width,
        tileConfig.collision.height);
    }
  }

  render(ctx, x, y) {
    ctx.drawImage(this.img,
      this.startx, this.starty,
      this.width, this.height,
      x, y,
      this.width, this.height
    );
  }
}

class CompositeTile {
  constructor(srcImg, tileConfig, refTiles) {
    this.img = srcImg;
    this.refTiles = refTiles;
    this.collisions = [];
    this.tiles = this.parseTiles(tileConfig["tiles"]);
  }

  render(ctx, x, y) {
    for (let i = 0; i < this.tiles.length; i++) {
      let indvTile = this.tiles[i];
      indvTile[0].render(ctx, indvTile[1] + x, indvTile[2] + y);
    }
  }

  parseTiles(tilesJson) {
    let tiles = [];
    this.collisions = [];
    for (let i = 0; i < tilesJson.length; i++) {
      let tile = this.refTiles[tilesJson[i][0]];
      tiles.push([
        tile,
        tilesJson[i][1],
        tilesJson[i][2]
      ]);
      this.collisions.concat(tile.collisions);
    }
    return tiles;
  }
}

class TileMap {
  constructor(img, json) {
    this.img = img;
    this.tiles = this.parseIndividualTiles(json["scalars"]);
    let composites = this.parseCompositeTiles(json["composites"]);
    this.tiles = {...this.tiles, ...composites};
  }

  renderTile(ctx, tileKey, x, y) {
    let tile = this.tiles[tileKey];
    if (tile) {
      tile.render(ctx, x, y);
    } else {
      console.log(`Tile with key = ${tileKey} does not exist in tilemap`);
    }
  }

  parseIndividualTiles(json) {
    let tiles = {};
    for (let tileKey in json) {
      tiles[tileKey] = new Tile(this.img, json[tileKey]);
    }
    return tiles;
  }

  parseCompositeTiles(json) {
    if (!json) {
      return {};
    }

    let tiles = {};
    for (let tileKey in json) {
      tiles[tileKey] = new CompositeTile(this.img, json[tileKey], this.tiles);
    }
    return tiles;
  }
}
