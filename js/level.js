
class Level {

  static FINAL_DISTANCE = 100;
  static FINAL_SCALE = 7;

  constructor(coordX, coordY) {
    let level = Math.hypot(coordX, coordY) / Level.FINAL_DISTANCE;
    level = Math.min(level, 1.0);
    console.log(`Level: ${level} (${coordX}, ${coordY}).`);

    let app = LD48.app;
    let scale = 1 + level * (Level.FINAL_SCALE - 1);
    this.state = new GameState(
      800 * scale,
      600 * scale,
      coordX,
      coordY,
      level
    );

    if (level > 0.25) {
      this.state.addRandomTeleport();
    }
    if (level > 0.5) {
      this.state.addRandomTeleport();
    }

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
      if (this.state.level >= 1.0) {
        // Win.
        this.doWin();
        return;
      } else {
        // Next level.
        this.detach();
        let rocket = this.state.rocket;
        let teleport = this.state.rocket.findTeleport();
        LD48.level = new Level(
          this.state.coordX + rocket.vx - teleport.vx,
          this.state.coordY + rocket.vy - teleport.vy
        );
        LD48.level.attach();
        return;
      }
    }
    // Playing.
    this.state.update(delta);
    this.view.update();
  }

  doWin() {
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
    LD48.app.stage.addChild(text);
    LD48.app.ticker.remove(this.gameLoopCallback);
    this.controller.detach();
  }

}
