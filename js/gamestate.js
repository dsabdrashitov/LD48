
class GameState {

  constructor(width, height, coordX, coordY, level) {
    this.level = level;

    this.coordX = coordX;
    this.coordY = coordY;

    this.worldWidth = width;
    this.worldHeight = height;
    this.rocket = new Rocket(this);
    this.teleports = [];
    this.addRandomTeleport();
    this.planets = [];
  }

  addRandomPlanet() {
    this.planets.push(new Planet(this));
  }

  addRandomTeleport() {
    this.teleports.push(new Teleport(this, (0.1 + 0.9 * Math.random()) * 10.0));
  }

  update(delta) {
    this.rocket.update(delta);
    this.teleports.forEach(teleport => {
      teleport.update(delta);
    });
    this.planets.forEach(planet => {
      planet.update(delta);
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

class Planet {

  static MIN_RADIUS = 64;
  static MAX_RADIUS = 400;

  constructor(gameState) {
    this.gameState = gameState;
    this.x = (0.3 + 0.7 * Math.random()) * gameState.worldWidth;
    this.y = (0.3 + 0.7 * Math.random()) * gameState.worldHeight;
    this.a = Math.random() * 2 * Math.PI;
    this.va = 2 * Math.PI * 0.1 / 60 * (0.2 + 0.8 * Math.random());
    this.radius = randomInt(Planet.MIN_RADIUS, Planet.MAX_RADIUS);
  }
  _moveObject(object) {
    let dist = Math.hypot(this.x - object.x, this.y - object.y);
    if (dist < this.radius) {
      let v = Math.hypot(object.vx, object.vy);
      let a = Math.atan2(object.vy, object.vx);
      // let at = Math.atan2(this.y - object.y, this.x - object.x);
      //let mult = 1.5 + 1.5 * Math.random();
      let an = a  + 3 * this.va;
      object.vx = v * Math.cos(an);
      object.vy = v * Math.sin(an);
    }
  }
  update(delta) {
    this.a = modFloat(this.a + this.va, 2 * Math.PI);
    this._moveObject(this.gameState.rocket);
  }
}

class Rocket {

  static RADIUS = 64;
  static ROTATION_ACCELERATION = 2 * Math.PI / 720;
  static ROTATION_FRICTION = 0.9;
  static MOVEMENT_ACCELERATION = 0.1;
  static MOVEMENT_FRICTION = 1.0;

  constructor(gameState) {
    this.gameState = gameState;
    this.x = (0.2 + 0.8 * Math.random()) * gameState.worldWidth;
    this.y = (0.2 + 0.8 * Math.random()) * gameState.worldHeight;
    this.a = 0;
    let initSpeed = (
      Rocket.MOVEMENT_ACCELERATION * 10 * (0.2 + 0.8 * Math.random())
    );
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
    for (let i = 0; i < this.gameState.teleports.length; i++) {
      if (this.gameState.teleports[i].isIn(this)) {
        return this.gameState.teleports[i];
      }
    }
    return null;
  }

}

class Teleport {

  static TOLERANCE = 112;
  static RADIUS = 16 + Teleport.TOLERANCE;
  static SPEED_TOLERANCE = 0.25;

  constructor(gameState, activationSpeed) {
    this.gameState = gameState;
    this.x = Math.random() * gameState.worldWidth;
    this.y = Math.random() * gameState.worldHeight;
    this.a = Math.random() * 2 * Math.PI;
    let alpha = Math.random() * 2 * Math.PI;
    let initSpeed = activationSpeed / 2 * (0.05 + 0.95 * Math.random());
    this.vx = initSpeed * Math.cos(alpha);
    this.vy = initSpeed * Math.sin(alpha);
    this.va = Math.random() * (Math.PI / 60) * 0.5;
    this.activationSpeed = activationSpeed;
  }

  update(delta) {
    this.x += this.vx;
    this.y += this.vy;
    this.x = modFloat(this.x, this.gameState.worldWidth);
    this.y = modFloat(this.y, this.gameState.worldHeight);
    this.a += this.va;
    this.a = modFloat(this.a, 2 * Math.PI);
  }

  power() {
    let vx = this.gameState.rocket.vx - this.vx;
    let vy = this.gameState.rocket.vy - this.vy;
    let v = Math.hypot(vx, vy);
    let power = v / this.activationSpeed;
    if (power < 1) {
      return power;
    }
    if (power > 1 + Teleport.SPEED_TOLERANCE) {
      return Math.max(0, (2 + Teleport.SPEED_TOLERANCE) - power);
    }
    return 1;
  }

  isActive() {
    return this.power() == 1;
  }

  isIn(rocket) {
    if (!this.isActive()) {
      return false;
    }
    let dxd = this.x - rocket.x;
    let dyd = this.y - rocket.y;
    let vx = rocket.vx - this.vx;
    let vy = rocket.vy - this.vy;
    let dv = Math.hypot(vx, vy);
    let dproj = (dxd * vx + dyd * vy) / dv;
    if (dproj < 0) {
      return false;
    }
    if (dproj > dv) {
      return false;
    }
    let xproj = rocket.x + dproj * vx / dv;
    let yproj = rocket.y + dproj * vy / dv;
    if (Math.hypot(xproj - this.x, yproj - this.y) > Teleport.TOLERANCE) {
      console.log(xproj - this.x, yproj - this.y);
      return false;
    }
    return true;
  }

}
