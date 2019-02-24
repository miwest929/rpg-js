class AssetManager {
  constructor() {
    this.queuedImages = [];
    this.queuedJsons = [];

    this.assetsLoadedFn = () => {};

    this.images = {};
    this.jsons = {};
  }

  getImg(key) {
    return this.images[key];
  }

  getJson(key) {
    return this.jsons[key];
  }

  setAssetsLoadedFn(loadedFn) {
    this.assetsLoadedFn = loadedFn;
  }

  queueImageAsset(path) {
    this.queuedImages.push(path);
  }

  queueJsonAsset(path) {
    this.queuedJsons.push(path);
  }

  loadAssets() {
    let targetLoadCount = this.queuedImages.length + this.queuedJsons.length;
    let alreadyLoadedCount = 0;

    for (let i = 0; i < this.queuedImages.length; i++) {
      let path = this.queuedImages[i];

      let img = new Image();
      img.onload = () => {
        alreadyLoadedCount++;

        if (alreadyLoadedCount >= targetLoadCount) {
          console.log("Finished loading all assets!");
          this.assetsLoadedFn();
        }
      }
      img.src = path;
      this.images[this.extractName(path)] = img;
    }

    for (let i = 0; i < this.queuedJsons.length; i++) {
      let path = this.queuedJsons[i];
      $.getJSON(path, (json) => {
        this.jsons[this.extractName(path)] = json;
        alreadyLoadedCount++;

        if (alreadyLoadedCount >= targetLoadCount) {
          console.log("Finished loading all assets!");
          this.assetsLoadedFn();
        }
      });
    }

    this.queuedImages.length = [];
    this.queuedJsons.length = [];
  }

  extractName(path) {
    if (path[0] === '.' ) {
      path = path.slice(1);
    }

    return path.split('/').pop();
  }
}
