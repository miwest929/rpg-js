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
    if (this.direction != FACING_UP) {
      this.direction = FACING_UP;
      this.animation = this.upAnimation;
    }

    if (!this.animation.inProgress()) {
      this.animation.play(this.animationFps);
    }
  }

  onKeyDownArrow(game) {
    if (this.direction != FACING_DOWN) {
      this.direction = FACING_DOWN;
      this.animation = this.downAnimation;
    }

    if (!this.animation.inProgress()) {
      this.animation.play(this.animationFps);
    }
  }

  onKeyLeftArrow() {
    if (this.direction != FACING_LEFT) {
      this.direction = FACING_LEFT;
      this.animation = this.leftAnimation;
    }

    if (!this.animation.inProgress()) {
      this.animation.play(this.animationFps);
    }
  }

  onKeyRightArrow() {
    if (this.direction != FACING_RIGHT) {
      this.direction = FACING_RIGHT;
      this.animation = this.rightAnimation;
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
