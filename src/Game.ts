import { Application } from "@pixi/app";
import { Shape, Triangle } from "./Shape";
import { intervalWorkerScript } from "./IntervalWorker";
import { GENERATION_INTERVAL_TIME, SET_INTERVAL } from "./constants";

class Game extends Application<HTMLCanvasElement> {
  private static instance: Game;
  private generateWorker: Worker;
    moveWorker: Worker;

  private constructor() {
    super({ resizeTo: window });
    this.generateWorker = new Worker(intervalWorkerScript, {
      name: "Shape Generator Worker",
    });
    this.generateRandomShape = this.generateRandomShape.bind(this);
    this.moveShapes = this.moveShapes.bind(this);
    this.generateWorker.onmessage = this.generateRandomShape;
    

    this.moveWorker = new Worker(intervalWorkerScript, {
        name: "Shape Movement Worker",
    });

    this.moveWorker.onmessage = this.moveShapes;
  }

  public static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }

    return Game.instance;
  }

  public addShape(shape: Shape) {
    this.stage.addChild(shape);
  }

  public getShapes() {
    return this.stage.children as Array<Shape>;
  }

  public generateRandomShape() {

    const x = Math.floor(Math.random() * (this.screen.width - 100));
    const triangle = new Triangle(100, "blue", x, 0);
    this.addShape(triangle);
  }

  public moveShapes() {
    this.getShapes().forEach((shape) => shape.moveDown(1));
  }

  public startShapeGeneration() {
    this.generateWorker.postMessage({
      id: SET_INTERVAL,
      timeMs: GENERATION_INTERVAL_TIME,
    });

    this.moveWorker.postMessage({
        id: SET_INTERVAL,
        timeMs: GENERATION_INTERVAL_TIME / 50,
      });
    
  }
}

export default Game.getInstance();
