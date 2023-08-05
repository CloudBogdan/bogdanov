import { onMount } from "solid-js";
import { createRef, mergeRefs } from "../../primitives";
import * as PIXI from "pixi.js";
import Game from "../../game/Game";

const GameCanvas: Solid.Component = ()=> {
    const ref = createRef<HTMLDivElement>();

    onMount(()=> {
        const element = ref.element;
        if (!element) return;

        const app = new PIXI.Application({
            width: 400,
            height: 400,
            antialias: false,
            backgroundAlpha: 1
        });
        element.appendChild(app.view as any);

        Game.setup(app);

        app.ticker.add(delta=> {
            Game.update(delta);
        });
    });
    
    return (
        <div class="game-canvas" ref={ mergeRefs([ref]) } />
    );
};

export default GameCanvas;