import { Graphics } from "@pixi/graphics";
import "@pixi/graphics-extras";
import Game from "./Game";
import { RADIUS } from "./constants";

export abstract class Shape extends Graphics {
  constructor(color: string, x: number, initialY: number) {
    super();
    this.color = color;
    this.x = x;
    this.y = initialY;
    this.radius = RADIUS;
    this.pivot.x = this.radius;
    this.pivot.y = this.radius;
    this.yLimit = Game.getScreen().height + this.radius * 2;
    this._draw();

    this.eventMode = "static";
    this.addEventListener("pointerdown", (e) => {
      this.destroy();
      e.preventDefault();
      e.stopPropagation();
    });
  }
  protected radius: number;
  protected color: string;
  protected yLimit: number;

  abstract _draw(): void;

  moveDown(value: number): void {
    if (this.y > this.yLimit) {
      this.destroy();

      return;
    }

    this.y += value;
  }
}

export class Triangle extends Shape {
  _draw(): void {
    this.beginFill(this.color).drawRegularPolygon?.(
      this.radius,
      this.radius,
      this.radius,
      3
    );
  }
}

export class Quadrilateral extends Shape {
  _draw(): void {
    this.beginFill(this.color).drawRegularPolygon?.(
      this.radius,
      this.radius,
      this.radius,
      4
    );
  }
}

export class Pentagon extends Shape {
  _draw(): void {
    this.beginFill(this.color).drawRegularPolygon?.(
      this.radius,
      this.radius,
      this.radius,
      5
    );
  }
}

export class Hexagon extends Shape {
  _draw(): void {
    this.beginFill(this.color).drawRegularPolygon?.(
      this.radius,
      this.radius,
      this.radius,
      6
    );
  }
}

export class Circle extends Shape {
  _draw(): void {
    this.beginFill(this.color).drawCircle(
      this.radius,
      this.radius,
      this.radius
    );
  }
}

export class Ellipse extends Shape {
  _draw(): void {
    this.beginFill(this.color).drawEllipse(
      this.radius,
      this.radius,
      this.radius,
      this.radius - 15
    );
  }
}

export class Start extends Shape {
  _draw(): void {
    this.beginFill(this.color).drawStar?.(
      this.radius,
      this.radius,
      5,
      this.radius - 30,
      this.radius
    );
  }
}
