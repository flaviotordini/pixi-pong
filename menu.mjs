import * as PIXI from './pixi.min.mjs';

export class Menu extends PIXI.Container {
    constructor(app) {
        super();

        app.state.container.addChild(this);

        this.pivot.set(0.5)
        this.x = app.state.container.width * .5;
        this.y = app.state.container.height * .5;

        const style = new PIXI.TextStyle({
            fontFamily: 'monospace',
            fontSize: app.state.container.width / 50 * 4,
            fontWeight: 'bold',
            fill: '#ffffff',
        });
        this.startText = new PIXI.Text({ text: 'Start', style: style });
        this.startText.anchor.set(0.5);
        this.startText.x = 0;
        this.startText.y = 0;
        this.addChild(this.startText);

        this.startText.eventMode = 'static';
        this.startText.cursor = 'pointer';
        this.startText.on('pointerdown', () => {
            this.visible = false;

            for (const paddle of app.state.paddles) {
                paddle.points = 0;
            }
        
            app.state.turn = Math.random() < 0.5;
            app.state.ball.initPos();
        });

    }
}
