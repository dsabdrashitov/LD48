
class Level {
  constructor(level) {
    console.log(level);
    this.level = level;
    let app = LD48.app;
    this.state = new GameState(
      app.screen.width * level,
      app.screen.height * level
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
    this.state.update(delta);
    this.view.update();
    if (this.state.goal()) {
      this.detach();
      LD48.level = new Level(1 + this.level % 5);
      LD48.level.attach();
    }
  }
}
