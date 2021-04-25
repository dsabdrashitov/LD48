
class Rocket {

  static RADIUS = 64;
  static ROTATION_ACCELERATION = 2 * Math.PI / 720;
  static ROTATION_FRICTION = 0.99;
  static MOVEMENT_ACCELERATION = 0.5;
  static MOVEMENT_FRICTION = 0.99;

  constructor(gameState) {
    this.gameState = gameState;
    this.x = (0.2 + 0.8 * Math.random()) * gameState.worldWidth;
    this.y = (0.2 + 0.8 * Math.random()) * gameState.worldHeight;
    this.a = 0;
    let initSpeed = Rocket.MOVEMENT_ACCELERATION * 10 * (0.2 + 0.8 * Math.random());
    this.vx = initSpeed * Math.cos(this.a);
    this.vy = initSpeed * Math.sin(this.a);
    this.va = 0;
    this.accel = 0;
    this.rotaccel = 0;
  }

  update(delta) {
    this.vx = this.vx * Rocket.MOVEMENT_FRICTION +
      this.accel * Math.cos(this.a);
    this.vy = this.vy * Rocket.MOVEMENT_FRICTION +
      this.accel * Math.sin(this.a);

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

  findTeleport() {
    let absoluteSpeed = Math.hypot(this.vx, this.vy);
    if (absoluteSpeed < 40) {
      return null;
    }
    for (let i = 0; i < this.gameState.teleports.length; i++) {
      if (this.gameState.teleports[i].isIn(this)) {
        return this.gameState.teleports[i];
      }
    }
  }

}

class Teleport {

  static TOLERANCE = 32;
  static RADIUS = 64 + Teleport.TOLERANCE;

  constructor(gameState) {
    this.gameState = gameState;
    this.x = Math.random() * gameState.worldWidth;
    this.y = Math.random() * gameState.worldHeight;
    this.a = Math.random() * 2 * Math.PI;
    let alpha = Math.random() * 2 * Math.PI;
    let initSpeed = 1 * (0.05 + 0.95 * Math.random());
    this.vx = initSpeed * Math.cos(alpha);
    this.vy = initSpeed * Math.sin(alpha);
    this.va = Math.random() * (Math.PI / 60) * 0.1;
  }

  update(delta) {
    this.x += this.vx;
    this.y += this.vy;
    this.x = modFloat(this.x, this.gameState.worldWidth);
    this.y = modFloat(this.y, this.gameState.worldHeight);
    this.a += this.va;
    this.a = modFloat(this.a, 2 * Math.PI);
  }

  isIn(rocket) {
    let dx1 = this.x - rocket.x;
    let dy1 = this.y - rocket.y;
    let dx2 = rocket.vx - this.vx;
    let dy2 = rocket.vy - this.vy;
    let len2 = Math.hypot(dx2, dy2);
    let vec = (dx1 * dy2 - dy1 * dx2) / len2;
    if (Math.abs(vec) > Teleport.TOLERANCE) {
      return false;
    }
    let at2r = Math.atan2(-dy1, -dx1);
    let len1 = Math.sin(at2r - this.a) * Math.hypot(dx1, dy1);
    if (Math.abs(len1) > Teleport.RADIUS) {
      return false;
    }
    console.log(this.a, at2r, vec);
    return true;
  }

}

class GameState {

  constructor(width, height, coordX, coordY) {
    this.coordX = coordX;
    this.coordY = coordY;
    this.worldWidth = width;
    this.worldHeight = height;
    this.rocket = new Rocket(this);
    this.teleports = [new Teleport(this)];
  }

  update(delta) {
    this.rocket.update(delta);
    this.teleports.forEach(teleport => {
      teleport.update(delta);
    });
  }

  goal() {
    let teleport = this.rocket.findTeleport();
    if (teleport === null) {
      return false;
    } else {
      return true;
    }
  }

}
