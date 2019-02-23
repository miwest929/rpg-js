class Tile {
  constructor(srcImg, tileConfig) {
    this.img = srcImg;
    this.startx = tileConfig.startx;
    this.starty = tileConfig.starty;
    this.width = tileConfig.width;
    this.height = tileConfig.height;
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

class TileMap {
  constructor(imgPath, jsonPath) {
    this.loaded = false;
    this.tiles = {};

    this.img = this.loadImg(imgPath);
    this.loadJson(jsonPath);
  }

  renderTile(ctx, tileKey, x, y) {
    let tile = this.tiles[tileKey];
    if (tile) {
      tile.render(ctx, x, y);
    } else {
      console.log(`Tile with key = ${tileKey} does not exist in tilemap`);
    }
  }

  loadImg(path) {
    let img = new Image();
    img.onload = () => {
      this.loaded = true;
      console.log("img = " + img.src + " finished loading");
    };
    img.src = path;
    return img;
  }

  loadJson(path) {
    $.getJSON(path, (json) => {
      console.log("tm.json = " + path + " finished loading");

      this.tiles = {};
      for (let tileKey in json) {
        this.tiles[tileKey] = new Tile(this.img, json[tileKey]);
      }
    });
  }
}
