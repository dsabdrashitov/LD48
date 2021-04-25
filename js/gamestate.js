
class Rocket {

  constructor(gameState) {
    this.gameState = gameState;
    this.x = 0;
    this.y = 0;
    this.a = 0;
    this.vx = 0;
    this.vy = 0;
    this.accel = 0;
  }

  update(delta) {
    this.vx = this.vx * 0.8 + this.accel * Math.cos(this.gameState.rocket.a);
    this.vy = this.vy * 0.8 + this.accel * Math.sin(this.gameState.rocket.a);

    this.a += randomInt(-1, 2) * 2 * Math.PI / 360;

    this.x += this.vx;
    this.y += this.vy;
    this.x = mod(this.x, this.gameState.worldWidth);
    this.y = mod(this.y, this.gameState.worldHeight);
  }

  accelerate(flag) {
    if (flag) {
      this.accel = 1.0;
    } else {
      this.accel = 0.0;
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
