
class Level {

  static FINAL_DISTANCE = 400;
  static FINAL_SCALE = 7;

  constructor(coordX, coordY) {
    this.level = Math.hypot(coordX, coordY) / Level.FINAL_DISTANCE;
    this.level = Math.min(this.level, 1.0);
    this.coordX = coordX;
    this.coordY = coordY;
    console.log(`Level: ${this.level} (${coordX}, ${coordY}).`);

    let app = LD48.app;
    let scale = 1 + this.level * (Level.FINAL_SCALE - 1);
    this.state = new GameState(
      app.screen.width * scale,
      app.screen.height * scale
    );
    this.view = new GameView(app.screen.width, app.screen.height, this.state);
  }
  attach() {
    let app = LD48.app;
    app.stage.addChild(this.view.getStage());
    this.gameLoopCallback = this.gameLoop.bind(this);
    app.ticker.add(this.gameLoopCallback);
    this.controller = new GameController(this.state);
  }
  detach() {
    let app = LD48.app;
    app.stage.removeChild(this.view.getStage());
    app.ticker.remove(this.gameLoopCallback);
    this.controller.detach();
  }
  gameLoop(delta) {
    if (this.state.goal()) {
      if (this.level >= 1.0) {
        // Win.
        let style = new PIXI.TextStyle({
          fontFamily: "Arial",
          fontSize: 36,
          fill: "white",
          stroke: '#ff3300',
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
        LD48.app.stage.addChild(text);
        LD48.app.ticker.remove(this.gameLoopCallback);
        this.controller.detach();
        return;
      } else {
        // Next level.
        this.detach();
        LD48.level = new Level(
          this.coordX + this.state.rocket.vx,
          this.coordY + this.state.rocket.vy
        );
        LD48.level.attach();
      }
    } else {
      // Playing.
      this.state.update(delta);
      this.view.update();
    }
  }
}
