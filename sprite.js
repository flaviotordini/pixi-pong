import * as PIXI from './pixi.min.mjs';

export class Sprite extends PIXI.Sprite {
    constructor(app, texture) {
        super();
        this.app = app;
        this.speed = 0;
        this.direction = 0;
        app.state.container.addChild(this);
        app.state.sprites.push(this);
    }

    tick(delta) {
        const degrees = this.direction * (Math.PI / 180);
        this.x += this.speed * delta * Math.sin(degrees);
        this.y += -this.speed * delta * Math.cos(degrees);
    }

    resize() {}
}