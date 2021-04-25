
class GameView {

  constructor(width, height, gameState) {
    this.width = width;
    this.height = height;
    this.state = gameState;
    this.stage = new PIXI.Container();
    this.stage.scale.x = width / gameState.worldWidth;
    this.stage.scale.y = height / gameState.worldHeight;

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
    //this.fireSprite.anchor.set(0.5, 0.7);
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
    return this.stage;
  }

  update() {
    let rocket = this.state.rocket;
    this.rocketContainer.position.set(rocket.x, rocket.y);
    this.rocketContainer.rotation = rocket.a;
    let accelFrac = rocket.accel / Rocket.MOVEMENT_ACCELERATION;
    this._setFireSize(accelFrac);

    this._updateTeleports();
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

}
