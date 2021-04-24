
class GameView {

  constructor(width, height, gameState) {
    console.log(width, height);
    const Sprite = PIXI.Sprite;
    this.width = width;
    this.height = height;
    this.state = gameState;
    this.stage = new PIXI.Container();
    this.stage.scale.x = width / gameState.worldWidth;
    this.stage.scale.y = height / gameState.worldHeight;
    let textures = LD48.textures;
    this.rocketSprite = new Sprite(textures["rocket.png"]);
    this.rocketSprite.anchor.set(0.5, 0.5);
    this.stage.addChild(this.rocketSprite);
    this.update();
  }

  getStage() {
    return this.stage;
  }

  update() {
    this.rocketSprite.position.set(this.state.rocket.x, this.state.rocket.y);
    this.rocketSprite.rotation = this.state.rocket.a + Math.PI / 2;
  }

}
