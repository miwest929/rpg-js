let FACING_LEFT = 0;
let FACING_RIGHT  = 1;
let FACING_UP = 2;
let FACING_DOWN = 3;

let WALKING_SPEED = 10;
let RUNNING_SPEED = 20;

class Player {
  constructor(game, initialX, initialY) {
    this.x = initialX;
    this.y = initialY;

    this.animationFps = WALKING_SPEED;
    this.MOVE_DIST = 16;

    let _this = this;
    this.upAnimation = game.getAnimation("playerMoveUp");
    this.upAnimation.setFrameTickFn(() => { _this.y -= 4; });

    this.downAnimation = game.getAnimation("playerMoveDown");
    this.downAnimation.setFrameTickFn(() => { _this.y += 4; });

    this.leftAnimation = game.getAnimation("playerMoveLeft");
    this.leftAnimation.setFrameTickFn(() => { _this.x -= 4; });

    this.rightAnimation = game.getAnimation("playerMoveRight");
    this.rightAnimation.setFrameTickFn(() => { _this.x += 4; });

    this.direction = FACING_LEFT;
    this.animation = this.leftAnimation;
  }

  goRun() {
    this.animationFps = RUNNING_SPEED;
  }

  goWalk() {
    this.animationFps = WALKING_SPEED;
  }

  moveDown(game) {
    this.move(FACING_DOWN, this.downAnimation);
  }

  moveUp(game) {
    this.move(FACING_UP, this.upAnimation);
  }

  moveLeft(game) {
    this.move(FACING_LEFT, this.leftAnimation);
  }

  moveRight(game) {
    this.move(FACING_RIGHT, this.rightAnimation);
  }

  move(direction, animation) {
    if (this.animation.inProgress()) {
      return;
    }

    if (this.direction != direction) {
      this.direction = direction;
      this.animation = animation;
    }

    if (!this.animation.inProgress()) {
      this.animation.play(this.animationFps);
    }
  }

  nextBoundingBox(direction) {
    let bb = this.boundingBox();

    let deltaX = 0;
    let deltaY = 0;
    if (direction == FACING_LEFT) {
      deltaX = -16;
    } else if (direction == FACING_RIGHT) {
      deltaX = 16;
    } else if (direction == FACING_DOWN) {
      deltaY = 16;
    } else if (direction == FACING_UP) {
      deltaY = -16;
    }

    return bb.offsetBy(deltaX, deltaY);
  }

  boundingBox() {
    let curTile = this.animation.getCurTile();
    console.log(`BB(x=${this.x}, y=${this.y}, w=${curTile.width}, h=${curTile.height})`);
    return new BoundingBox(
      this.x, this.y, curTile.width, curTile.height
    );
  }

  render(ctx, camera) {
    if (this.animation) {
      this.animation.render(ctx, this.x, this.y);
    }
  }
}
