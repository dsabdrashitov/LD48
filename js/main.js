
window.LD48 = {
  app: null,
  state: null,
  view: null,
  controller: null,
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
  let app = LD48.app;
  LD48.state = new GameState(app.screen.width * 1, app.screen.height * 1);
  LD48.view = new GameView(app.screen.width, app.screen.height, LD48.state);
  let view = LD48.view;
  app.stage.addChild(view.getStage());
  app.ticker.add(gameLoop);
  LD48.controller = new GameController(LD48.state);
}

function gameLoop(delta) {
  LD48.state.update(delta);
  LD48.view.update();
}

start();
