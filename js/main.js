
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
}

start();
