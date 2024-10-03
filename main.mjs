import * as PIXI from './pixi.min.mjs';
import { Ball } from "./ball.mjs";
import { Paddle } from "./paddle.mjs";

// Asynchronous IIFE
(async () => {
    // Create a PixiJS application.
    const app = new PIXI.Application();

    // Intialize the application.
    await app.init({ background: '#1099bb', resizeTo: window });

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(app.canvas);

    const container = new PIXI.Container();
    app.stage.addChild(container);
    container.boundsArea = new PIXI.Rectangle(0, 0, app.screen.width, app.screen.height);

    app.state = {};
    app.state.container = container;
    app.state.sprites = [];
    app.ticker.add((ticker) => {
        for (const sprite of app.state.sprites) {
            sprite.tick(ticker.deltaTime);
        }
    });

    app.state.ball = new Ball(app);

    app.state.paddles = [];
    const paddlesConfs = [
        {
            isLeft: true,
            fire: 'Shift',
            left: 'a',
            right: 'd',
            up: 'w',
            down: 's'
        },
        {
            isLeft: false,
            fire: ' ',
            left: 'ArrowLeft',
            right: 'ArrowRight',
            up: 'ArrowUp',
            down: 'ArrowDown'
        }
    ];
    for (const conf of paddlesConfs) {
        const paddle = new Paddle(app, conf);
        app.state.paddles.push(paddle);
    }

    // Keyboard events
    document.addEventListener('keydown', onKeyDown);
    function onKeyDown(key) {
        for (const paddle of app.state.paddles) {
            paddle.onKeyDown(key);
        }
    }

    document.addEventListener('keyup', onKeyUp);
    function onKeyUp(key) {
        for (const paddle of app.state.paddles) {
            paddle.onKeyUp(key);
        }
    }

    startMatch(app);

})()

function startMatch(app) {
    for (const paddle of app.state.paddles) {
        paddle.points = 0;
    }

    app.state.turn = Math.random() < 0.5;
    app.state.ball.initPos();
}
