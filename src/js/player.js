let FACING_LEFT = 0;
let FACING_RIGHT  = 1;
let FACING_UP = 2;
let FACING_DOWN = 3;

class Player {
  constructor(game, initialX, initialY) {
    this.x = initialX;
    this.y = initialY;

    this.upAnimation = game.getAnimation("playerMoveUp");
    this.downAnimation = game.getAnimation("playerMoveDown");
    this.leftAnimation = game.getAnimation("playerMoveLeft");
    this.rightAnimation = game.getAnimation("playerMoveRight");

    this.direction = FACING_LEFT;
    this.animation = this.leftAnimation;
  }

  onKeyUpArrow() {
    if (this.direction != FACING_UP) {
      this.direction = FACING_UP;
      this.animation = this.upAnimation;
      this.animation.playLoop(10);
    }
  }

  onKeyDownArrow() {
    if (this.direction != FACING_DOWN) {
      this.direction = FACING_DOWN;
      this.animation = this.downAnimation;
      this.animation.playLoop(10);
    }
  }

  onKeyLeftArrow() {
    if (this.direction != FACING_LEFT) {
      this.direction = FACING_LEFT;
      this.animation = this.leftAnimation;
      this.animation.playLoop(10);
    }
  }

  onKeyRightArrow() {
    if (this.direction != FACING_RIGHT) {
      this.direction = FACING_RIGHT;
      this.animation = this.rightAnimation;
      this.animation.playLoop(10);
    }
  }

  render(game) {
    if (this.animation) {
      this.animation.render(game.context, this.x, this.y);
    }
  }
}
