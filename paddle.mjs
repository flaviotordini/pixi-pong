import { Sprite } from "./sprite.js";
import * as PIXI from './pixi.min.mjs';
import { Ball } from "./ball.mjs";
import { sound } from './pixi-sound.mjs';

export class Paddle extends Sprite {
    constructor(app, conf) {
        super(app);
        this.conf = conf;
        this.texture = PIXI.Texture.WHITE;
        this.anchor.set(0.5);
        this.points = 0;

        const style = new PIXI.TextStyle({
            fontFamily: 'monospace',
            fontWeight: 'bold',
            fill: '#ffffff',
        });
        this.pointsText = new PIXI.Text({ text: '0', style: style });
        this.pointsText.anchor.set(0.5);
        this.pointsText.alpha = .5;
        app.state.container.addChild(this.pointsText);

        sound.add(conf.id, './' + conf.id + '.mp3');

        this.resize();
    }

    resize() {
        this.width = this.app.state.container.width / 50;
        this.height = this.width * 4;

        if (this.conf.isLeft) {
            this.x = this.width;
        } else {
            this.x = this.app.state.container.width - this.width;
        }
        this.y = this.app.state.container.height * .5;

        this.pointsText.x = this.conf.isLeft ? this.app.state.container.width / 4 : this.app.state.container.width / 4 * 3;
        this.pointsText.y = this.height;
        this.pointsText.style.fontSize = this.height;
    }

    incrementPoints() {
        this.points++;
        this.pointsText.text = this.points.toString();
    }

    resetPoints() {
        this.points = 0;
        this.pointsText.text = this.points.toString();
    }

    tick(delta) {
        const maxSpeedIncrement = 12;
        const halfPaddleHeight = this.height / 2;

        const paddle = this;
        const ball = this.app.state.ball;
        const factor = this.conf.isLeft ? 1 : -1;
        const xLimit = paddle.x + (paddle.width * .5) * factor;

        if (ball.visible) {
            if (ball.x * factor < xLimit * factor) {
                if (ball.y < paddle.y + halfPaddleHeight
                    && ball.y > paddle.y - halfPaddleHeight) {

                    // impact with ball

                    ball.x = xLimit;

                    const impactY = ball.y - (paddle.y - halfPaddleHeight);
                    const spinDegrees = (impactY * 90 / paddle.height) - 45;
                    ball.direction = -ball.direction + spinDegrees * factor;

                    const distanceFromPaddleCenter = Math.abs(paddle.y - ball.y);
                    // distanceFromPaddleCenter : maxDistance = x : maxSpeedIncrement
                    const speedIncrement = (distanceFromPaddleCenter * maxSpeedIncrement / halfPaddleHeight);
                    ball.speed = Ball.BASE_SPEED + speedIncrement;

                    sound.play(this.conf.id);

                } else {

                    // point
                    ball.visible = false;

                    const otherPaddleIndex = this.conf.isLeft ? 1 : 0;
                    const otherPaddle = this.app.state.paddles[otherPaddleIndex];
                    otherPaddle.incrementPoints();
                    if (otherPaddle.points === 10) {
                        this.app.state.menu.visible = true;
                    } else {
                        this.app.state.turn = !this.app.state.turn;
                        ball.initPos();
                    }
                }
            }
        }

        const topLimit = this.y - halfPaddleHeight <= 0;
        if (topLimit && this.direction === 0) {
            this.speed = 0;
            this.y = halfPaddleHeight;
            return;
        }

        const bottomLimit = this.y + halfPaddleHeight >= this.app.state.container.height;
        if (bottomLimit && this.direction === 180) {
            this.speed = 0;
            this.y = this.app.state.container.height - halfPaddleHeight;
            return;
        }

        super.tick(delta);
    }

    onKeyDown(key) {
        // Up
        if (key.key === this.conf.up) {
            this.speed = 10;
            this.direction = 0;
        }
        // Down
        if (key.key === this.conf.down) {
            this.speed = 10;
            this.direction = 180;
        }
    }

    onKeyUp(key) {
        // Up
        if (key.key === this.conf.up) {
            this.speed = 0;
        }
        // Down
        if (key.key === this.conf.down) {
            this.speed = 0;
        }
    }

}