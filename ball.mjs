import { Sprite } from "./sprite.js";
import * as PIXI from './pixi.min.mjs';

export class Ball extends Sprite {

    static SPEED_FACTOR = 0.4;

    constructor(app) {
        super(app);
        this.texture = PIXI.Texture.WHITE;
        this.anchor.set(0.5);
        this.visible = false;
        this.speed = 0;

        this.resize();
    }

    resize() {
        this.width = this.app.state.container.width / 50;
        this.height = this.width;

        // oldX : oldWidth = x : newWidth
        this.x = this.x * this.app.state.container.width / this.oldWidth;
        this.y = this.y * this.app.state.container.height / this.oldHeight;
        this.speed = this.speed * this.app.state.container.width / this.oldWidth;

        this.oldWidth = this.app.state.container.width;
        this.oldHeight = this.app.state.container.height;
    }

    initPos() {
        this.x = this.app.state.container.width * 0.5;
        this.y = this.app.state.container.height * Math.random();
        this.direction = Math.random() * 90 + 45;
        if (this.app.state.turn) {
            this.direction += 180;
        }
        this.speed = this.width * Ball.SPEED_FACTOR;
        this.visible = true;
    }

    tick(delta) {
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