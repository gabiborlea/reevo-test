import { Graphics } from "@pixi/graphics";
import Game from "./Game";

export abstract class Shape extends Graphics {
   abstract _draw(): void;
   abstract moveDown(value: number): void;
}

export class Triangle extends Shape {
    color: string;
    constructor(height: number, color: string, x: number, initialY: number) {
        super();
        this.triangleHeight = height;
        this.x = x;
        this.y = initialY;
        this.color = color;
        this.pivot.x = 0;
        this.pivot.y = height;
        this._draw();

    }
    _draw(): void {
        this.beginFill(this.color, 1);
        this.lineStyle(0, 1);
        this.moveTo(this.triangleHeight, 0);
        this.lineTo(this.triangleHeight / 2, this.triangleHeight); 
        this.lineTo(0, 0);
        this.lineTo(this.triangleHeight / 2, 0);
        this.endFill();
    }

    moveDown(value: number): void {
        if (this.y > Game.view.height + this.triangleHeight) {
            this.destroy();

            return;
        }

        this.y += value;
    }
}