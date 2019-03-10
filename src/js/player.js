let FACING_LEFT = 0;
let FACING_RIGHT  = 1;
let FACING_UP = 2;
let FACING_DOWN = 3;

class Player {
  constructor(game, initialX, initialY) {
    this.x = initialX;
    this.y = initialY;

    this.animationFps = 10;

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

  onKeyUpArrow(game) {
    this.move(FACING_UP, this.upAnimation);
  }

  onKeyDownArrow(game) {
    this.move(FACING_DOWN, this.downAnimation);
  }

  onKeyLeftArrow() {
    this.move(FACING_LEFT, this.leftAnimation);
  }

  onKeyRightArrow() {
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

  render(ctx, camera) {
    if (this.animation) {
      this.animation.render(ctx, this.x, this.y);
    }
  }
}
