import { Sprite } from "./sprite.js";
import * as PIXI from './pixi.min.mjs';

export class Paddle extends Sprite {
    constructor(app, conf) {
        super(app);
        this.conf = conf;
        this.texture = PIXI.Texture.WHITE;
        this.anchor.set(0.5);
        this.width = app.state.container.width / 50;
        this.height = this.width * 4;
        this.points = 0;

        if (conf.isLeft) {
            this.x = this.width;
        } else {
            this.x = app.state.container.width - this.width;
        }

        this.y = app.state.container.height * .5;

        this.pointsText = new PIXI.Text({ text: '0' });
        this.pointsText.anchor.set(0.5);
        this.pointsText.x = conf.isLeft ? app.state.container.width / 4 : app.state.container.width / 4 * 3;
        this.pointsText.y = this.height;
        app.state.container.addChild(this.pointsText);
    }

    incrementPoints() {
        this.points++;
        this.pointsText.text = this.points.toString();
    }

    tick(delta) {
        const halfPaddleHeight = this.height / 2;
        const topLimit = this.y - halfPaddleHeight < 0;
        if (topLimit) {
            console.log("topLimit");
            this.speed = 0;
            this.y = halfPaddleHeight;
            return;
        }
        
        const bottomLimit = this.y + halfPaddleHeight > this.app.state.container.height;
        if (bottomLimit) {
            console.log("bottomLimit");
            this.speed = 0;
            this.y = this.app.state.container.height - halfPaddleHeight;
            return;
        }

        super.tick(delta);
    }

    onKeyDown(key) {
        // Up
        if (key.key === this.conf.up) {
            console.log("up");
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