
class GameView {

  constructor(width, height, gameState) {
    this.width = width;
    this.height = height;
    this.state = gameState;
    this.stage = new PIXI.Container();
    this.stage.scale.x = width / gameState.worldWidth;
    this.stage.scale.y = height / gameState.worldHeight;
    this.rocketContainer = this._createRocket();
    this.stage.addChild(this.rocketContainer);
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
  }

}
