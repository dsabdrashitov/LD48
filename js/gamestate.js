
class Rocket {

  constructor(gameState) {
    this.gameState = gameState;
    this.x = 0;
    this.y = 0;
    this.a = 0;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
  }

  update(delta) {
    let accel = Math.random()
    this.ax = accel * Math.cos(this.gameState.rocket.a);
    this.ay = accel * Math.sin(this.gameState.rocket.a);
    this.vx *= 0.8;
    this.vy *= 0.8;
    this.a += randomInt(-1, 2) * 2 * Math.PI / 360;

    this.vx += this.ax;
    this.vy += this.ay;
    this.x += this.vx;
    this.y += this.vy;
    this.x = mod(this.x, this.gameState.worldWidth);
    this.y = mod(this.y, this.gameState.worldHeight);
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
