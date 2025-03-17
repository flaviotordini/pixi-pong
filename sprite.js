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
        const radiants = this.direction * (Math.PI / 180);
        this.x += this.speed * delta * Math.sin(radiants);
        this.y += -this.speed * delta * Math.cos(radiants);
    }

    resize() {}
}