import { Sprite } from "./sprite.js";
import * as PIXI from './pixi.min.mjs';

export class Ball extends Sprite {
    constructor(app) {
        super(app);
        this.texture = PIXI.Texture.WHITE;
        this.anchor.set(0.5);
        this.width = app.state.container.width / 50;
        this.height = this.width;
        this.speed = 10;
        this.initPos();
    }

    initPos() {
        this.x = this.app.state.container.width * Math.random();
        this.y = this.app.state.container.height * Math.random();
        this.direction = Math.random() * 360;
    }

    tick(delta) {
        const leftPaddle = this.app.state.paddles[0];
        if (this.x < leftPaddle.x + (leftPaddle.width * .5)) {
            const halfPaddleHeight = leftPaddle.height * .5;
            if (this.y < leftPaddle.y + halfPaddleHeight
                && this.y > leftPaddle.y - halfPaddleHeight) {
                this.direction = -this.direction;
            } else {
                this.initPos();
            }
        }

        const rightPaddle = this.app.state.paddles[1];
        if (this.x > rightPaddle.x - (rightPaddle.width * .5)) {
            const halfPaddleHeight = rightPaddle.height * .5;
            if (this.y < rightPaddle.y + halfPaddleHeight
                && this.y > rightPaddle.y - halfPaddleHeight) {
                this.direction = -this.direction;
            } else {
                this.initPos();
            }
        }

        const bounds = this.app.state.container.getBounds();
        const inside = bounds.rectangle.intersects(this.getBounds().rectangle);
        // const inside = bounds.containsPoint(this.x, this.y);
        if (!inside) {
            this.direction = 180 - this.direction;
        }
        super.tick(delta);
    }
}