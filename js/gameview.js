
class GameView {

  constructor(width, height, gameState) {
    this.width = width;
    this.height = height;
    this.state = gameState;
    this.stage = new PIXI.Container();
    this.stage.scale.x = width / gameState.worldWidth;
    this.stage.scale.y = height / gameState.worldHeight;
    this.stageInfo = new PIXI.Container();

    this.stageBackground = new PIXI.Container();
    this.stageUnderRocketLarge = new PIXI.Container();
    this.stageUnderRocketSmall = new PIXI.Container();
    this.stageRocket = new PIXI.Container();
    this.stageOverRocket = new PIXI.Container();

    this.stage.addChild(this.stageBackground);
    this.stage.addChild(this.stageUnderRocketLarge);
    this.stage.addChild(this.stageUnderRocketSmall);
    this.stage.addChild(this.stageRocket);
    this.stage.addChild(this.stageOverRocket);

    this.rocketContainer = this._createRocket();
    this.stageRocket.addChild(this.rocketContainer);

    this.teleportsCache = [];
    this.planetsCache = [];

    this.starsCollection = new StarsCollection(gameState);
    this.stageBackground.addChild(this.starsCollection.getStage());

    this.levelInfo = new DistanceToFinalInfo(this.state.level, width, height);
    this.stageInfo.addChild(this.levelInfo.getContainer());

    this.allStage = new PIXI.Container();
    this.allStage.addChild(this.stage);
    this.allStage.addChild(this.stageInfo);

    if (gameState.voyager != null) {
      this.finalVoyager = new PIXI.Sprite(LD48.textures["voyager.png"]);
      this.finalVoyager.scale.set(2, 2);
      this.finalVoyager.pivot.set(140, 113);
      this.stageRocket.addChild(this.finalVoyager);
      this.levelInfo.getContainer().visible = false;
    }

    this.update();
  }

  _createRocket() {
    const Sprite = PIXI.Sprite;
    let textures = LD48.textures;
    let rocketContainer = new PIXI.Container();
    let rocketSprite = new Sprite(textures["rocket.png"]);
    rocketSprite.pivot.set(136, 157);
    rocketSprite.rotation = Math.PI / 2;
    let rs = Rocket.RADIUS / 60; //textures["rocket.png"].height;
    rocketSprite.scale.set(rs, rs);
    this.fireSprite = new Sprite(textures["fire.png"]);
    this.basicFireScale = 1.5 * Rocket.RADIUS / textures["fire.png"].height;
    this._setFireSize(0.0);
    this.fireSprite.pivot.set(63, 93);
    this.fireSprite.rotation = -Math.PI / 2;
    this.fireSprite.x = -Rocket.RADIUS;
    this.fireSprite.y = 0;
    rocketContainer.addChild(this.fireSprite);
    rocketContainer.addChild(rocketSprite);
    return rocketContainer;
  }

  _setFireSize(fraction) {
    this.fireSprite.scale.set(
      this.basicFireScale * (fraction * 0.7 + 0.3) * (Math.random() + 0.1),
      this.basicFireScale * (fraction * 0.7 + 0.3) * (Math.random() + 0.1)
    );
  }

  getStage() {
    return this.allStage;
  }

  update() {
    let rocket = this.state.rocket;
    this.rocketContainer.position.set(rocket.x, rocket.y);
    this.rocketContainer.rotation = rocket.a;
    let accelFrac = rocket.accel / Rocket.MOVEMENT_ACCELERATION;
    this._setFireSize(accelFrac);

    this._updateTeleports();
    this._updatePlanets();

    this.levelInfo.update();

    this.starsCollection.update();

    if (this.state.voyager != null) {
      this.finalVoyager.x = this.state.voyager.x;
      this.finalVoyager.y = this.state.voyager.y;
      this.finalVoyager.rotation = this.state.voyager.a;

      let style = new PIXI.TextStyle({
        fontFamily: "Arial",
        fontSize: 36,
        fill: "white",
        stroke: '#33ff00',
        strokeThickness: 4,
        dropShadow: true,
        dropShadowColor: "#000000",
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
      });
      let text = new PIXI.Text("You won!", style);
      text.position.set(
        LD48.app.screen.width / 2,
        LD48.app.screen.height / 2
      );
      text.anchor.set(0.5, 0.5);
      this.stageInfo.addChild(text);
    }
  }

  _updateTeleports() {
    let toAdd = this.state.teleports.length - this.teleportsCache.length;
    for (let i = toAdd; i >= 0; i--) {
      let tback = new PIXI.Sprite(LD48.textures["blackhole-back.png"])
      let tfront = new PIXI.Sprite(LD48.textures["blackhole-front.png"])
      tback.visible = false;
      tfront.visible = false;
      this.stageUnderRocketSmall.addChild(tback);
      this.stageOverRocket.addChild(tfront);
      tback.pivot.set(120, 120);
      tfront.pivot.set(120, 120);
      let scale = Teleport.RADIUS / 120;
      tback.scale.set(scale, scale);
      tfront.scale.set(scale, scale);
      this.teleportsCache.push([tback, tfront]);
    }
    for (
      let i = this.state.teleports.length; i < this.teleportsCache.length; i++
    ) {
      this.teleportsCache[i][0].visible = false;
      this.teleportsCache[i][1].visible = false;
    }
    for (let i = 0; i < this.state.teleports.length; i++) {
      let tback = this.teleportsCache[i][0];
      let tfront = this.teleportsCache[i][1];
      let teleport = this.state.teleports[i];
      tback.position.set(teleport.x, teleport.y);
      tfront.position.set(teleport.x, teleport.y);
      tback.rotation = teleport.a;
      tfront.rotation = teleport.a;
      tback.visible = true;
      let power = teleport.power();
      tback.alpha = teleport.power() ** 3;
      tfront.visible = teleport.isActive();
    }
  }

  _updatePlanets() {
    let toAdd = this.state.planets.length - this.planetsCache.length;
    const names = ["planet1.png", "planet2.png", "planet3.png"];
    for (let i = toAdd; i >= 0; i--) {
      let name = names[randomInt(0, names.length)];
      let sprite = new PIXI.Sprite(LD48.textures[name])
      sprite.visible = false;
      this.stageUnderRocketLarge.addChild(sprite);
      sprite.pivot.set(200, 200);
      this.planetsCache.push(sprite);
    }
    for (
      let i = this.state.planets.length; i < this.planetsCache.length; i++
    ) {
      this.planetsCache[i].visible = false;
    }
    for (let i = 0; i < this.state.planets.length; i++) {
      let sprite = this.planetsCache[i];
      let planet = this.state.planets[i];
      let scale = planet.radius / 200;
      sprite.scale.set(scale, scale);
      sprite.position.set(planet.x, planet.y);
      sprite.rotation = planet.a;
      sprite.visible = true;
    }
  }

}

class DistanceToFinalInfo {
  constructor(level, width, height) {
    this.level = level;
    this.width = width;
    this.height = height;
    this.container = new PIXI.Container();
    this.graphics = null;
    this.voyager_a = 0;
    this.voyager_va = (2 * Math.PI * 0.1) / 60;
    this.voyager = new PIXI.Sprite(LD48.textures["voyager.png"])
    this.voyager.pivot.set(140, 113);
    // this.voyager.pivot.set(130, 142);
    this.voyager.width = 64;
    this.voyager.height = 64;
    this.voyager.position.set(this.width - 32, this.height - 32);
    this.voyager.rotation = this.voyager_a;
    this.container.addChild(this.voyager);
    // let g = new PIXI.Graphics();
    // g.lineStyle(2, 0xFFFFFF, 0.5);
    // g.drawRect(this.voyager.x - 47, this.voyager.y - 47, 94, 94);
    // this.container.addChild(g);
    this.update();
  }
  getContainer() {
    return this.container;
  }
  update() {
    if (this.graphics != null) {
      this.container.removeChild(this.graphics);
    }
    this.graphics = this._buildGraphics(this.level);
    this.container.addChild(this.graphics);
    this.voyager_a = modFloat(this.voyager_a + this.voyager_va, 2 * Math.PI);
    this.voyager.rotation = this.voyager_a;
  }
  _buildGraphics(level) {
    let g = new PIXI.Graphics();
    g.lineStyle(2, 0xFFFFFF, 0.5);
    let bx0 = 10;
    let by0 = this.height - 35;
    let bw = (this.width - 70) - bx0;
    let bh = (this.height - 25) - by0;
    g.drawRect(bx0, by0, bw, bh);
    g.lineStyle(0);
    g.beginFill(0xFFFFFF, 0.3);
    let maxLen = bw - 2 * 3;
    g.drawRect(bx0 + 3, by0 + 3, maxLen * level, bh - 2 * 3);
    g.endFill();
    return g;
  }
}

class StarsCollection {

  static FINAL_SPEED = 1000;

  constructor(gameState) {
    this.width = gameState.worldWidth;
    this.height = gameState.worldHeight;

    let al = Math.atan2(-gameState.coordY, -gameState.coordX);
    let len = Math.hypot(gameState.coordX, gameState.coordY);
    len = len / Level.FINAL_DISTANCE * StarsCollection.FINAL_SPEED;
    this.vx = len * Math.cos(al);
    this.vy = len * Math.sin(al);

    this.stage = new PIXI.Container();
    this.canvas = new PIXI.Graphics();

    let g = this.canvas;
    // let cnt = Math.floor((this.width * this.height) / 10000);
    let cnt = Math.ceil(this.width / 40);
    for (let i = 0; i < cnt; i++) {
      let x0 = Math.random() * this.width;
      let y0 = Math.random() * this.height;
      let sr = 1 + Math.random() * 5;
      g.lineStyle(sr, 0xFFFFFF);
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          let x1 = x0 + dx * this.width;
          let y1 = y0 + dy * this.height;
          g.moveTo(x1, y1);
          g.lineTo(
            x1 + sr * Math.cos(al),
            y1 + sr * Math.sin(al)
          );
        }
      }

      // g.lineStyle(0);
      // g.beginFill(0xFFFFFF);
      // g.drawCircle(x0, y0, sr);
      // g.endFill();
    }

    this.stage.addChild(this.canvas);
  }

  getStage() {
    return this.stage;
  }

  update() {
    this.canvas.x += this.vx / 60;
    this.canvas.y += this.vy / 60;
    this.canvas.x = modFloat(this.canvas.x, this.width);
    this.canvas.y = modFloat(this.canvas.y, this.height);
  }

}
