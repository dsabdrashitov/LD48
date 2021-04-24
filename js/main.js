const Sprite = PIXI.Sprite;

let app = new PIXI.Application();
document.body.appendChild(app.view);

PIXI.loader
  .add("images/main-sheet.json")
  .load(resourcesLoaded);

let textures;

function resourcesLoaded() {
  textures = PIXI.loader.resources["images/main-sheet.json"].textures;
  let rocket = new Sprite(textures["rocket.png"]);
  rocket.x = app.stage.width / 2;
  rocket.y = app.stage.height / 2;
  app.stage.addChild(rocket);
}
