
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
    this.keyLeft.press = () => {
      this.accelerateRotation(-1);
    };
    this.keyLeft.release = () => {
      this.accelerateRotation(0);
    };
    this.keyRight.press = () => {
      this.accelerateRotation(1);
    };
    this.keyRight.release = () => {
      this.accelerateRotation(0);
    };
  }

  accelerate(flag) {
    this.state.rocket.accelerate(flag);
  }

  accelerateRotation(dir) {
    this.state.rocket.accelerateRotation(dir);
  }

  detach() {
    this.keyAccelerate.unsubscribe();
    this.keyLeft.unsubscribe();
    this.keyRight.unsubscribe();
  }

}
