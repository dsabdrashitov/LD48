
class GameController {

  constructor(gameState) {
    this.state = gameState;
    this.keyAccelerate = keyboard("ArrowUp");
    this.keyLeft = keyboard("ArrowLeft");
    this.keyRight = keyboard("ArrowRight");
    this.keyAccelerate.press = () => {
      this.accelerate(true);
    };
    this.keyAccelerate.release = () => {
      this.accelerate(false);
    };
  }

  accelerate(flag) {
    this.state.rocket.accelerate(flag);
  }

  detouch() {
    this.keyAccelerate.unsubscribe();
    this.keyLeft.unsubscribe();
    this.keyRight.unsubscribe();
  }

}
