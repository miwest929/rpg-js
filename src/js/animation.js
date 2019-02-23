class Animation {
  constructor(animTiles) {
    this.tiles = animTiles;
    this.frameIdx = 0;
    this.intervalId = null;
  }

  play(fps) {
    this.stop();
    this.frameIdx = 0;

    let period = 1000 / fps;
    this.intervalId = window.setInterval(() => {
      this.frameIdx += 1

      if (this.frameIdx >= this.tiles.length) {
        this.stop();
        this.frameIdx = 0;
      }
    }, period);
  }

  playLoop(fps) {
    this.stop();
    this.frameIdx = 0;

    let period = 1000 / fps;
    this.intervalId = window.setInterval(() => {
      this.frameIdx = (this.frameIdx + 1) % this.tiles.length;
    }, period);
  }

  stop() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }

  render(ctx, x, y) {
    this.tiles[this.frameIdx].render(ctx, x, y);
  }
}
