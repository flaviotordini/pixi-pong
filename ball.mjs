import { Sprite } from "./sprite.js";
import * as PIXI from './pixi.min.mjs';

export class Ball extends Sprite {
    constructor(app) {
        super(app);
        this.texture = PIXI.Texture.WHITE;
        this.anchor.set(0.5);
        this.width = app.state.container.width / 50;
        this.height = this.width;
        this.initPos();
    }

    initPos() {
        this.x = this.app.state.container.width * Math.random();
        this.y = this.app.state.container.height * Math.random();
        this.direction = Math.random() * 360;
        this.speed = 10;
    }

    tick(delta) {
        const leftPaddle = this.app.state.paddles[0];
        if (this.x < leftPaddle.x + (leftPaddle.width * .5)) {
            const halfPaddleHeight = leftPaddle.height * .5;
            if (this.y < leftPaddle.y + halfPaddleHeight
                && this.y > leftPaddle.y - halfPaddleHeight) {

                const impactY = this.y - (leftPaddle.y - halfPaddleHeight);
                const spinDegrees = (impactY * 90 / leftPaddle.height) - 45;
                this.direction = -this.direction + spinDegrees;

                const speedIncrement = (impactY * 5 / leftPaddle.height);
                this.speed += speedIncrement;

            } else {
                this.initPos();
            }
        }

        const rightPaddle = this.app.state.paddles[1];
        if (this.x > rightPaddle.x - (rightPaddle.width * .5)) {
            const halfPaddleHeight = rightPaddle.height * .5;
            if (this.y < rightPaddle.y + halfPaddleHeight
                && this.y > rightPaddle.y - halfPaddleHeight) {

                const impactY = this.y - (rightPaddle.y - halfPaddleHeight);
                const spinDegrees = (impactY * 90 / rightPaddle.height) - 45;
                this.direction = -this.direction - spinDegrees;

                const speedIncrement = (impactY * 5 / rightPaddle.height);
                this.speed += speedIncrement;

            } else {
                this.initPos();
            }
        }

        if (this.y - this.height / 2 <= 0) {
            this.direction = 180 - this.direction;
            this.y = 0 + this.height / 2;
        } else if (this.y + this.height / 2 >= this.app.state.container.height) {
            this.direction = 180 - this.direction;
            this.y = this.app.state.container.height - this.height / 2;
        }

        super.tick(delta);
    }
}