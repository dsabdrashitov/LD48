window.LD48 = {
  app: null,
  state: null,
  textures: null,
};

function start() {
  let app = new PIXI.Application();
  LD48.app = app;
  document.body.appendChild(app.view);
  LD48.state = new GameState();
  PIXI.loader
    .add("images/main-sheet.json")
    .load(resourcesLoaded);
}

const Sprite = PIXI.Sprite;

let rocketSprite;

var resourcesLoaded = function() {
  let textures = PIXI.loader.resources["images/main-sheet.json"].textures;
  LD48.textures = textures;
  let app = LD48.app;
  let rocket = LD48.state.rocket
  rocketSprite = new Sprite(textures["rocket.png"]);
  rocketSprite.position.set(rocket.x, rocket.y);
  rocketSprite.anchor.set(0.5, 0.5);
  rocketSprite.rotation = rocket.a + Math.PI / 2;
  app.stage.addChild(rocketSprite);
  app.ticker.add(gameLoop);
}

function gameLoop(delta) {
  let state = LD48.state;
  let accel = Math.random()
  state.rocket.ax = accel * Math.cos(state.rocket.a);
  state.rocket.ay = accel * Math.sin(state.rocket.a);
  state.rocket.vx *= 0.8;
  state.rocket.vy *= 0.8;
  state.rocket.a += randomInt(-1, 2) * 2 * Math.PI / 360;
  LD48.state.update();
  rocketSprite.position.set(state.rocket.x, state.rocket.y);
  rocketSprite.anchor.set(0.5, 0.5);
  rocketSprite.rotation = state.rocket.a + Math.PI / 2;
}

start();
