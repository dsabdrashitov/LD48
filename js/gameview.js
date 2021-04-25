
class GameView {

  constructor(width, height, gameState) {
    const Sprite = PIXI.Sprite;
    this.width = width;
    this.height = height;
    this.state = gameState;
    this.stage = new PIXI.Container();
    this.stage.scale.x = width / gameState.worldWidth;
    this.stage.scale.y = height / gameState.worldHeight;
    let textures = LD48.textures;
    this.rocketContainer = new PIXI.Container();
    this.stage.addChild(this.rocketContainer);
    this.rocketSprite = new Sprite(textures["rocket.png"]);
    this.rocketSprite.anchor.set(0.5, 0.5);
    this.rocketSprite.rotation = Math.PI / 2;
    this.rocketContainer.addChild(this.rocketSprite);
    this.fireSprite = new Sprite(textures["fire.png"]);
    this.fireSprite.anchor.set(0.5, 0.7);
    this.fireSprite.rotation = -Math.PI / 2;
    this.fireSprite.x = -this.rocketSprite.height * 0.37;
    this.fireSprite.y = this.rocketSprite.width * 0.04;
    this.rocketContainer.addChild(this.fireSprite);
    this.update();
  }

  getStage() {
    return this.stage;
  }

  update() {
    let rocket = this.state.rocket;
    this.rocketContainer.position.set(rocket.x, rocket.y);
    this.rocketContainer.rotation = rocket.a;
    let accelFrac = rocket.accel / Rocket.MOVEMENT_ACCELERATION;
    this.fireSprite.scale.set(
      (accelFrac * 0.7 + 0.3) * (Math.random() + 0.1),
      (accelFrac * 0.7 + 0.3) * (Math.random() + 0.1)
    );
  }

}
