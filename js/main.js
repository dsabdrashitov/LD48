const Sprite = PIXI.Sprite;

let app = new PIXI.Application();
document.body.appendChild(app.view);

PIXI.loader
  .add("images/main-sheet.json")
  .load(resourcesLoaded);

let textures;
let rocket;

function resourcesLoaded() {
  textures = PIXI.loader.resources["images/main-sheet.json"].textures;
  rocket = new Sprite(textures["rocket.png"]);
  rocket.x = app.stage.width / 2;
  rocket.y = app.stage.height / 2;
  rocket.anchor.set(0.5, 0.5);
  app.stage.addChild(rocket);
  app.ticker.add(gameLoop);
}

function randomInt(from, to) {
  return Math.floor(Math.random() * (to - from) + from);
}

function gameLoop(delta) {
  let x = rocket.x - 1;
  let y = rocket.y + randomInt(-1, 2);
  x = (x % app.renderer.width + app.renderer.width) % app.renderer.width;
  y = (y % app.renderer.height + app.renderer.height) % app.renderer.height;
  rocket.position.set(x, y);
  console.log(x, y);
}
