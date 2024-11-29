import * as PIXI from './pixi.min.mjs';

export class Menu extends PIXI.Container {
    constructor(app) {
        super();
        this.app = app;
        app.state.container.addChild(this);

        this.pivot.set(0.5)
       
        const style = new PIXI.TextStyle({
            fontFamily: 'monospace',
            fontWeight: 'bold',
            fill: '#ffffff',
        });
        this.startText = new PIXI.Text({ text: 'Start', style: style });
        this.startText.anchor.set(0.5);
        this.startText.x = 0;
        this.startText.y = 0;
        this.addChild(this.startText);

        const startMatch = () => {
            this.visible = false;

            for (const paddle of app.state.paddles) {
                paddle.resetPoints();
            }

            app.state.turn = Math.random() < 0.5;
            app.state.ball.initPos();
        };

        this.startText.eventMode = 'static';
        this.startText.cursor = 'pointer';
        this.startText.on('pointerdown', startMatch);

        document.addEventListener('keydown', (key) => {
            let ticker = app.ticker;
            if (ticker.started) {
                if (key.key === 'Escape') {
                    app.state.ball.visible = false;
                    this.visible = true;
                } else if (key.key === ' ' || key.key === 'Enter') {
                    if (this.visible) startMatch();
                } else if (key.key === 'p' || key.key === 'Pause') {
                    ticker.stop();
                }
            } else {
                ticker.start();
            }
        });

        this.resize();
    }

    resize() {
        this.x = this.app.state.container.width * .5;
        this.y = this.app.state.container.height * .5;
        this.startText.style.fontSize = this.app.state.container.width / 50 * 4;
    }

}
