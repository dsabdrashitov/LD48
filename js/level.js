
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
    if (level > 0.05) {
      if (Math.random() > 0.3) {
        this.state.addRandomPlanet();
      }
      if (level > 0.4) {
        for (let i = randomInt(0, 4); i > 0; i--) {
          this.state.addRandomPlanet();
        }
      }
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
    let app = LD48.app;
    this.detach();

    this.state = new GameState(
      this.state.worldWidth,
      this.state.worldHeight,
      this.state.coordX,
      this.state.coordY,
      this.state.level
    );

    this.state.rocket.x = this.state.worldWidth / 3;
    this.state.rocket.y = this.state.worldHeight / 3;
    this.state.voyager = new Voyager();
    this.state.voyager.x = this.state.worldWidth / 3 * 2;
    this.state.voyager.y = this.state.worldHeight / 3 * 2;

    this.state.teleports = [];
    this.state.planets = [];

    this.view = new GameView(app.screen.width, app.screen.height, this.state);
    app.stage.addChild(this.view.getStage());
    this.gameLoopCallback = this.gameLoop.bind(this);
    app.ticker.add(this.gameLoopCallback);
  }

}
