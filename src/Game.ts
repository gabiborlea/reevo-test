import { Application } from "@pixi/app";
import "@pixi/events";
import {
  Circle,
  Ellipse,
  Hexagon,
  Pentagon,
  Quadrilateral,
  Shape,
  Start,
  Triangle,
} from "./Shape";
import { intervalWorkerScript } from "./IntervalWorker";
import { GENERATION_INTERVAL_TIME, RADIUS, SET_INTERVAL } from "./constants";

class Game extends Application<HTMLCanvasElement> {
  private static instance: Game;
  private generateWorker: Worker;
  private moveWorker: Worker;
  private gravity: number;
  private shapesConstructors = [
    Triangle,
    Circle,
    Quadrilateral,
    Pentagon,
    Hexagon,
    Ellipse,
    Start,
  ];

  private constructor() {
    const root = document.getElementById("root");
    super({ resizeTo: root ?? undefined });
    this.gravity = 4;
    this.generateWorker = new Worker(intervalWorkerScript, {
      name: "Shape Generator Worker",
    });
    this.addShapeRandomX = this.addShapeRandomX.bind(this);
    this.moveShapes = this.moveShapes.bind(this);
    this.generateWorker.onmessage = this.addShapeRandomX;

    this.moveWorker = new Worker(intervalWorkerScript, {
      name: "Shape Movement Worker",
    });

    this.moveWorker.onmessage = this.moveShapes;

    this.stage.eventMode = "static";
    this.stage.hitArea = this.screen;

    this.stage.addEventListener("pointerdown", (e) => {
      const shape = this.generateRandomShape(0, 0);
      shape.position.copyFrom(e.global);
      this.addShape(shape);
    });
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

  public addShapeRandomX() {
    const x =
      RADIUS + Math.floor(Math.random() * (this.screen.width - 2 * RADIUS));
    this.addShape(this.generateRandomShape(x, -RADIUS));
  }

  public generateRandomShape(x: number, y: number) {
    const constructorIndex = Math.floor(
      Math.random() * this.shapesConstructors.length
    );
    const color =
      "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
    return new this.shapesConstructors[constructorIndex](color, x, y);
  }

  public moveShapes() {
    this.getShapes().forEach((shape) => shape.moveDown(this.gravity));
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
