
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
