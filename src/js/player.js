let FACING_LEFT = 0;
let FACING_RIGHT  = 1;
let FACING_UP = 2;
let FACING_DOWN = 3;

class Player {
  constructor(initialX, initialY) {
    this.direction = FACING_LEFT;
    this.x = initialX;
    this.y = initialY;

    this.animation = null;
  }

  onKeyUpArrow(game) {
    if (this.direction != FACING_UP) {
      this.direction = FACING_UP;
      this.animation = game.animations["playerMoveUp"];
      this.animation.playLoop(10);
    }
  }

  onKeyDownArrow() {
    if (this.direction != FACING_DOWN) {
      this.direction = FACING_DOWN;
      this.animation = game.animations["playerMoveDown"];
      this.animation.playLoop(10);
    }
  }

  onKeyLeftArrow() {
    if (this.direction != FACING_LEFT) {
      this.direction = FACING_LEFT;
      this.animation = game.animations["playerMoveLeft"];
      this.animation.playLoop(10);
    }
  }

  onKeyRightArrow() {
    if (this.direction != FACING_RIGHT) {
      this.direction = FACING_RIGHT;
      this.animation = game.animations["playerMoveRight"];
      this.animation.playLoop(10);
    }
  }

  render(game) {
    if (this.animation) {
      this.animation.render(game.context, this.x, this.y);
    }
  }
}
