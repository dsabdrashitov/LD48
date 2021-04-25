
class Rocket {

  static ROTATION_ACCELERATION = 2 * Math.PI / 720;
  static ROTATION_FRICTION = 0.99;
  static MOVEMENT_ACCELERATION = 0.5;
  static MOVEMENT_FRICTION = 0.99;

  constructor(gameState) {
    this.gameState = gameState;
    this.x = 0;
    this.y = 0;
    this.a = 0;
    this.vx = 0;
    this.vy = 0;
    this.va = 0;
    this.accel = 0;
    this.rotaccel = 0;
  }

  update(delta) {
    this.vx = this.vx * Rocket.MOVEMENT_FRICTION +
      this.accel * Math.cos(this.gameState.rocket.a);
    this.vy = this.vy * Rocket.MOVEMENT_FRICTION +
      this.accel * Math.sin(this.gameState.rocket.a);

    this.va = this.va * Rocket.ROTATION_FRICTION + this.rotaccel;

    this.x += this.vx;
    this.y += this.vy;
    this.x = modFloat(this.x, this.gameState.worldWidth);
    this.y = modFloat(this.y, this.gameState.worldHeight);

    this.a += this.va;
    this.a = modFloat(this.a, 2 * Math.PI);
  }

  accelerate(forward) {
    if (forward) {
      this.accel = Rocket.MOVEMENT_ACCELERATION;
    } else {
      this.accel = 0.0;
    }
  }

  accelerateRotation(dir) {
    if (dir < 0) {
      this.rotaccel = -Rocket.ROTATION_ACCELERATION;
    } else if (dir > 0) {
      this.rotaccel = Rocket.ROTATION_ACCELERATION;
    } else {
      this.rotaccel = 0;
    }
  }

}

class GameState {

  worldWidth = 800;
  worldHeight = 600;

  constructor() {
    this.rocket = new Rocket(this);
  }

  update(delta) {
    this.rocket.update(delta);
  }

}
