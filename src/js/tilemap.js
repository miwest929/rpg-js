class TileMap {
  constructor(imgPath, jsonPath) {
    this.loaded = false;
    this.config = {};

    this.img = this.loadImg(imgPath);
    this.loadJson(jsonPath);
  }

  renderTile(ctx, tileKey, x, y) {
    let tile = this.config[tileKey];
    ctx.drawImage(this.img,
      tile.startx, tile.starty,
      tile.width, tile.height,
      x, y,
      tile.width, tile.height);
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
      this.config = json;
      console.log("tm.json = " + path + " finished loading");
    });
  }
}
