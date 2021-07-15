import MovingDirection from "./MovingDirection.js";

export default class Pacman {
  constructor(x, y, tileSize, velocity, tileMap) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.velocity = velocity;
    this.tileMap = tileMap;

    this.currentMovingDirection = null;
    this.requestedMovingDirection = null;

    this.pacmanAnimationTimerDefault = 10;
    this.pacmanAnimationTimer = null;

    this.pacmanRotation = this.Rotation.right;
    this.wakaSound = new Audio("../sounds/waka.wav");

    document.addEventListener("keydown", this.#keydown);

    this.#loadPacmanImages();
  }

  Rotation = {
    right: 0,
    down: 1,
    left: 2,
    up: 3,
  };

  draw(ctx) {
    this.#move();
    this.#animate();
    this.#eatDot();
    const size = this.tileSize / 2;

    ctx.save();
    ctx.translate(this.x + size, this.y + size);
    ctx.rotate((this.pacmanRotation * 90 * Math.PI) / 180);
    ctx.drawImage(
      this.pacmanImages[this.pacmanImageIndex],
      -size,
      -size,
      this.tileSize,
      this.tileSize
    );

    ctx.restore();

    // ctx.drawImage(
    //   this.pacmanImages[this.pacmanImageIndex],
    //   this.x,
    //   this.y,
    //   this.tileSize,
    //   this.tileSize
    // );
  }

  #loadPacmanImages() {
    const pacmanImage1 = new Image();
    pacmanImage1.src = "../images/pac0.png";

    const pacmanImage2 = new Image();
    pacmanImage2.src = "../images/pac1.png";

    const pacmanImage3 = new Image();
    pacmanImage3.src = "../images/pac2.png";

    const pacmanImage4 = new Image();
    pacmanImage4.src = "../images/pac1.png";

    this.pacmanImages = [
      pacmanImage1,
      pacmanImage2,
      pacmanImage3,
      pacmanImage4,
    ];

    this.pacmanImageIndex = 0;
  }

  #keydown = (event) => {
    //up
    if (event.keyCode == 38) {
      if (this.currentMovingDirection == MovingDirection.down)
        this.currentMovingDirection = MovingDirection.up;
      this.requestedMovingDirection = MovingDirection.up;
    }
    //down
    if (event.keyCode == 40) {
      if (this.currentMovingDirection == MovingDirection.up)
        this.currentMovingDirection = MovingDirection.down;
      this.requestedMovingDirection = MovingDirection.down;
    }
    //left
    if (event.keyCode == 37) {
      if (this.currentMovingDirection == MovingDirection.right)
        this.currentMovingDirection = MovingDirection.left;
      this.requestedMovingDirection = MovingDirection.left;
    }
    //right
    if (event.keyCode == 39) {
      if (this.currentMovingDirection == MovingDirection.left)
        this.currentMovingDirection = MovingDirection.right;
      this.requestedMovingDirection = MovingDirection.right;
    }
  };

  #move() {
    if (this.currentMovingDirection !== this.requestedMovingDirection) {
      if (
        Number.isInteger(this.x / this.tileSize) &&
        Number.isInteger(this.y / this.tileSize)
      ) {
        if (
          !this.tileMap.didCollideWithEnvironment(
            this.x,
            this.y,
            this.requestedMovingDirection
          )
        )
          this.currentMovingDirection = this.requestedMovingDirection;
      }
    }

    if (
      this.tileMap.didCollideWithEnvironment(
        this.x,
        this.y,
        this.currentMovingDirection
      )
    ) {
      this.pacmanAnimationTimer = null;
      this.pacmanImageIndex = 1;
      return;
    } else if (
      this.currentMovingDirection != null &&
      this.pacmanAnimationTimer == null
    ) {
      this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
    }

    switch (this.currentMovingDirection) {
      case MovingDirection.up:
        this.y -= this.velocity;
        this.pacmanRotation = this.Rotation.up;
        break;
      case MovingDirection.down:
        this.y += this.velocity;
        this.pacmanRotation = this.Rotation.down;
        break;
      case MovingDirection.left:
        this.x -= this.velocity;
        this.pacmanRotation = this.Rotation.left;
        break;
      case MovingDirection.right:
        this.x += this.velocity;
        this.pacmanRotation = this.Rotation.right;
        break;
    }
  }

  #animate() {
    if (this.pacmanAnimationTimer == null) {
      return;
    }
    this.pacmanAnimationTimer--;
    if (this.pacmanAnimationTimer == 0) {
      this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
      this.pacmanImageIndex++;
      if (this.pacmanImageIndex == this.pacmanImages.length)
        this.pacmanImageIndex = 0;
    }
  }

  #eatDot() {
    if (this.tileMap.eatDot(this.x, this.y)) {
      // this.wakaSound.play();
    }
  }
}
