
window.LD48 = {
  app: null,
  level: null,
  textures: null,
};

function start() {
  LD48.app = new PIXI.Application();
  let app = LD48.app;
  document.body.appendChild(app.view);
  PIXI.loader
    .add("images/main-sheet.json")
    .load(resourcesLoaded);
}

function resourcesLoaded() {
  LD48.textures = PIXI.loader.resources["images/main-sheet.json"].textures;
  LD48.level = new Level(1);
  LD48.level.attach();
  setInterval(function() {
    LD48.level.detach();
    LD48.level = new Level(1 + LD48.level.level % 5);
    LD48.level.attach();
  }, 5000);
}

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
  }
}

start();
