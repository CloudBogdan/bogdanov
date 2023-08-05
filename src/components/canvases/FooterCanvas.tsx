import { onMount } from "solid-js";
import { createRef, mergeRefs } from "../../primitives";
import * as PIXI from "pixi.js";
import TapeHandAnimation from "../../animations/footer/TapeHandAnimation";

const FooterCanvas: Solid.Component = ()=> {
    const ref = createRef<HTMLDivElement>();

    onMount(()=> {
        const element = ref.element;
        if (!element) return;

        const app = new PIXI.Application({
            width: Math.max(Math.floor(innerWidth/2), 600),
            height: Math.floor(innerHeight),
            antialias: false,
            backgroundAlpha: 0
        });
        element.appendChild(app.view as any);

        TapeHandAnimation.setup(app);

        app.ticker.add(delta=> {
            TapeHandAnimation.update();
        })

    });
    
    return (
        <div class="footer-canvas graphic" ref={ mergeRefs([ref]) } />
    );
};

export default FooterCanvas;