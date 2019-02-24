class Tile {
  constructor(srcImg, tileConfig) {
    this.img = srcImg;
    this.startx = tileConfig.startx;
    this.starty = tileConfig.starty;
    this.width = tileConfig.width;
    this.height = tileConfig.height;
  }

  render(ctx, x, y, zoom) {
    ctx.drawImage(this.img,
      this.startx, this.starty,
      this.width, this.height,
      x, y,
      this.width * 2, this.height * 2
    );
  }
}

class TileMap {
  constructor(img, json) {
    this.img = img;
    this.tiles = this.parseJson(json);
  }

  renderTile(ctx, tileKey, x, y) {
    let tile = this.tiles[tileKey];
    if (tile) {
      tile.render(ctx, x, y, 1.5);
    } else {
      console.log(`Tile with key = ${tileKey} does not exist in tilemap`);
    }
  }

  parseJson(json) {
    let tiles = {};
    for (let tileKey in json) {
      tiles[tileKey] = new Tile(this.img, json[tileKey]);
    }
    return tiles;
  }
}
