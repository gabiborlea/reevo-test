import { Application } from "@pixi/app";
import { Text, TextStyle } from "@pixi/text";
import { Container } from "@pixi/display";
import "@pixi/events";
import "@pixi/extract";
import { FederatedPointerEvent } from "@pixi/events";
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
import { Renderer } from "pixi.js";

class Game {
  private static instance: Game;
  private app: Application<HTMLCanvasElement>;
  private generateWorker: Worker;
  private moveWorker: Worker;
  private gravity = 4;
  private shapesPerSecond = 1;
  private shapesConstructors = [
    Triangle,
    Circle,
    Quadrilateral,
    Pentagon,
    Hexagon,
    Ellipse,
    Start,
  ];
  private shapeContainer: Container;
  private shapeCount: Text;
  private area: Text;

  public onTextUpdate: (shapesCount: number, area: number) => void;

  private constructor() {
    this.app = new Application();

    this.getGravity = this.getGravity.bind(this);
    this.increaseGravity = this.increaseGravity.bind(this);
    this.decreaseGravity = this.decreaseGravity.bind(this);

    this.getShapesPerSecond = this.getShapesPerSecond.bind(this);
    this.increaseShapesPerSecond = this.increaseShapesPerSecond.bind(this);
    this.decreaseShapesPerSecond = this.decreaseShapesPerSecond.bind(this);

    this.addShapeRandomX = this.addShapeRandomX.bind(this);
    this.addShapeOnClick = this.addShapeOnClick.bind(this);
    this.moveShapes = this.moveShapes.bind(this);

    this.generateWorker = new Worker(intervalWorkerScript, {
      name: "Shape Generator Worker",
    });

    this.generateWorker.onmessage = this.addShapeRandomX;

    this.moveWorker = new Worker(intervalWorkerScript, {
      name: "Shape Movement Worker",
    });

    this.moveWorker.onmessage = this.moveShapes;

    this.app.stage.eventMode = "static";
    this.app.stage.hitArea = this.app.screen;

    this.app.stage.addEventListener("pointerdown", this.addShapeOnClick);

    this.addContainer();
    this.addText();
  }

  public static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }

    return Game.instance;
  }

  private addShape(shape: Shape) {
    this.shapeContainer.addChild(shape);
  }

  private getShapes() {
    return this.shapeContainer.children as Array<Shape>;
  }

  public setResizeTo(element: HTMLElement) {
    this.app.resizeTo = element;
  }

  public addShapeRandomX() {
    for (let i = 0; i < this.shapesPerSecond; i++) {
      const x =
        RADIUS +
        Math.floor(Math.random() * (this.app.screen.width - 2 * RADIUS));
      this.addShape(this.generateRandomShape(x, -RADIUS));
    }
  }

  public addShapeOnClick(e: FederatedPointerEvent) {
    const shape = this.generateRandomShape(0, 0);
    shape.position.copyFrom(e.global);
    this.addShape(shape);
  }

  public getRandomColor() {
    let color = "#000000";

    while (color === "#000000") {
      color =
        "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
    }

    return color;
  }

  public generateRandomShape(x: number, y: number) {
    const constructorIndex = Math.floor(
      Math.random() * this.shapesConstructors.length
    );

    return new this.shapesConstructors[constructorIndex](
      this.getRandomColor(),
      x,
      y
    );
  }

  public moveShapes() {
    this.getShapes().forEach((shape) => shape.moveDown(this.gravity));
    this.updateText();
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

  private addContainer() {
    this.shapeContainer = new Container();
    this.shapeContainer.x = 0;
    this.shapeContainer.y = 0;
    this.app.stage.addChild(this.shapeContainer);
  }
  private addText() {
    const style = new TextStyle({
      fontFamily: "Arial",
      fontSize: 36,
      fontStyle: "italic",
      fontWeight: "bold",
      fill: ["#ffffff", "#00ff99"], // gradient
      stroke: "#4a1850",
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: "#000000",
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440,
      lineJoin: "round",
    });

    this.shapeCount = new Text("0 shapes", style);
    this.shapeCount.x = 10;
    this.shapeCount.y = 10;
    this.area = new Text("0px", style);
    this.area.x = 10;
    this.area.y = 50;

    this.app.stage.addChild(this.shapeCount);
    this.app.stage.addChild(this.area);
  }

  private updateText() {
    const shapes = this.getShapes().length;
    const area = this.app.renderer.extract.pixels(this.shapeContainer).length - 4;
    this.shapeCount.text = `${shapes} shapes`;
    this.area.text = `${area} area`;

    this.onTextUpdate?.(shapes, area);
  }

  public getScreen() {
    return this.app.screen;
  }

  public getView() {
    return this.app.view;
  }

  public getGravity() {
    return this.gravity;
  }
  public increaseGravity() {
    this.gravity++;
  }

  public decreaseGravity() {
    if (this.gravity > 0) {
      this.gravity--;
    }
  }

  public getShapesPerSecond() {
    return this.shapesPerSecond;
  }
  public increaseShapesPerSecond() {
    this.shapesPerSecond++;
  }

  public decreaseShapesPerSecond() {
    if (this.shapesPerSecond > 1) {
      this.shapesPerSecond--;
    }
  }
}

export default Game.getInstance();
