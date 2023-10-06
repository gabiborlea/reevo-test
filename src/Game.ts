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
    super({ resizeTo: root });
    this.gravity = 4;
    this.generateWorker = new Worker(intervalWorkerScript, {
      name: "Shape Generator Worker",
    });
    this.generateShapeRandomX = this.generateShapeRandomX.bind(this);
    this.moveShapes = this.moveShapes.bind(this);
    this.generateWorker.onmessage = this.generateShapeRandomX;

    this.moveWorker = new Worker(intervalWorkerScript, {
      name: "Shape Movement Worker",
    });

    this.moveWorker.onmessage = this.moveShapes;

    this.view.onclick = (e) => {
      this.generateRandomShape(e.offsetX, e.offsetY);
      e.stopPropagation();
      e.preventDefault();
    };
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

  public generateShapeRandomX() {
    const x =
      RADIUS + Math.floor(Math.random() * (this.screen.width - 2 * RADIUS));
    this.generateRandomShape(x, -RADIUS);
  }

  public generateRandomShape(x: number, y: number) {
    const constructorIndex = Math.floor(
      Math.random() * this.shapesConstructors.length
    );
    const color =
      "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
    const shape = new this.shapesConstructors[constructorIndex](color, x, y);
    this.addShape(shape);
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
