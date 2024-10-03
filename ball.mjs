import { Sprite } from "./sprite.js";
import * as PIXI from './pixi.min.mjs';

const BASE_SPEED = 15;
const maxSpeedIncrement = 5;

export class Ball extends Sprite {
    constructor(app) {
        super(app);
        this.texture = PIXI.Texture.WHITE;
        this.anchor.set(0.5);
        this.width = app.state.container.width / 50;
        this.height = this.width;
        this.visible = false;
        this.speed = 0;
    }

    initPos() {
        this.x = this.app.state.container.width * 0.5;
        this.y = this.app.state.container.height * Math.random();
        this.direction = Math.random() * 90 + 45;
        if (this.app.state.turn) {
            this.direction += 180;
        }
        this.speed = BASE_SPEED;
        this.visible = true;
    }

    tick(delta) {
        const leftPaddle = this.app.state.paddles[0];
        const leftXLimit = leftPaddle.x + (leftPaddle.width * .5);
        if (this.x < leftXLimit) {
            const halfPaddleHeight = leftPaddle.height * .5;
            if (this.y < leftPaddle.y + halfPaddleHeight
                && this.y > leftPaddle.y - halfPaddleHeight) {

                this.x = leftXLimit;

                const impactY = this.y - (leftPaddle.y - halfPaddleHeight);
                const spinDegrees = (impactY * 90 / leftPaddle.height) - 45;
                this.direction = -this.direction + spinDegrees;

                const distanceFromPaddleCenter = Math.abs(leftPaddle.y - this.y);
                // distanceFromPaddleCenter : maxDistance = x : maxSpeedIncrement
                const speedIncrement = (distanceFromPaddleCenter * maxSpeedIncrement / halfPaddleHeight);
                this.speed = BASE_SPEED + speedIncrement;

            } else {
                if (this.visible) this.initPos();
            }
        }

        const rightPaddle = this.app.state.paddles[1];
        const rightXLimit = rightPaddle.x - (rightPaddle.width * .5);
        if (this.x > rightXLimit) {
            const halfPaddleHeight = rightPaddle.height * .5;
            if (this.y < rightPaddle.y + halfPaddleHeight
                && this.y > rightPaddle.y - halfPaddleHeight) {

                this.x = rightXLimit;

                const impactY = this.y - (rightPaddle.y - halfPaddleHeight);
                const spinDegrees = (impactY * 90 / rightPaddle.height) - 45;
                this.direction = -this.direction - spinDegrees;

                const distanceFromPaddleCenter = Math.abs(rightPaddle.y - this.y);
                // distanceFromPaddleCenter : maxDistance = x : maxSpeedIncrement
                const speedIncrement = (distanceFromPaddleCenter * maxSpeedIncrement / halfPaddleHeight);
                this.speed = BASE_SPEED + speedIncrement;

            } else {
                if (this.visible) this.initPos();
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