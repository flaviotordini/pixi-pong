import * as PIXI from './pixi.min.mjs';
import { Ball } from "./ball.mjs";
import { Paddle } from "./paddle.mjs";
import { Menu } from './menu.mjs';

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

    container.eventMode = 'static';
    container.hitArea = container.boundsArea;
    function paddleForEvent(event) {
        let isLeft = event.data.global.x < container.width * .5;
        let paddleIndex = isLeft ? 0 : 1;
        return app.state.paddles[paddleIndex];
    }
    container.on('pointerdown', (event) => {
        event.stopPropagation();
        let paddle = paddleForEvent(event);
        let isTop = event.data.y < container.height * .5;
        if (isTop) {
            paddle.moveUp();
        } else {
            paddle.moveDown();
        }
    });
    container.on('pointerup', (event) => {
        event.stopPropagation();
        let paddle = paddleForEvent(event);
        let isTop = event.data.y < container.height * .5;
        if (isTop) {
            paddle.stopUp();
        } else {
            paddle.stopDown();
        }
    });

    app.state = {};
    app.state.container = container;
    app.state.sprites = [];
    app.ticker.add((ticker) => {
        for (const sprite of app.state.sprites) {
            sprite.tick(ticker.deltaTime);
        }
    });

    app.renderer.on('resize', () => {
        container.boundsArea.width = app.screen.width;
        container.boundsArea.height = app.screen.height;

        function lazyResize() {
            for (const sprite of app.state.sprites) {
                sprite.resize();
            }
            app.state.menu.resize();
        }
        setTimeout(lazyResize, 100);
    })

    app.state.ball = new Ball(app);

    app.state.paddles = [];
    const paddlesConfs = [
        {
            id: "paddle1",
            isLeft: true,
            fire: 'Shift',
            left: 'a',
            right: 'd',
            up: 'w',
            down: 's'
        },
        {
            id: "paddle2",
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

    app.state.menu = new Menu(app);

    app.goFullscreen = function() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }
        if (screen.orientation) {
            if (screen.orientation.type != "landscape") {
                screen.orientation.lock("landscape");
            }
        }
    }

})()
