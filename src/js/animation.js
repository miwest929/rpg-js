class Animation {
  constructor(animTiles) {
    this.tiles = animTiles;
    this.frameIdx = 0;
    this.frameTickFn = () => {};
    this.intervalId = null;
  }

  setFrameTickFn(frameTickFn) {
    this.frameTickFn = frameTickFn;
  }

  inProgress() {
    return this.intervalId;
  }

  play(fps) {
    this.stop();
    this.frameIdx = 0;

    let period = 1000 / fps;
    this.intervalId = window.setInterval(() => {
      this.frameIdx += 1

      this.frameTickFn();

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
      this.frameTickFn();
    }, period);
  }

  stop() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getCurTile() {
    return this.tiles[this.frameIdx];
  }

  render(ctx, x, y) {
    this.tiles[this.frameIdx].render(ctx, x, y);
  }
}
