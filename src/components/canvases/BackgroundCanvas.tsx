import { onMount } from "solid-js";
import * as PIXI from "pixi.js";
import { createRef, mergeRefs } from "../../primitives";
import SkyAnimation from "../../animations/background/SkyAnimation";
import ObjectsFallingAnimation from "../../animations/background/ObjectsFallingAnimation";
import FooterBackgroundAnimation from "../../animations/background/FooterBackgroundAnimation";
import AppAnimation from "../../animations/AppAnimation";

const BackgroundCanvas: Solid.Component = ()=> {
    const ref = createRef<HTMLDivElement>();
    
    onMount(()=> {
        const element = ref.element;
        if (!element) return;

        const app = new PIXI.Application({
            width: Math.floor(innerWidth),
            height: Math.floor(innerHeight),
            antialias: false,
            backgroundAlpha: 0
        });
        element.appendChild(app.view as any);

        ObjectsFallingAnimation.setup(app);
        SkyAnimation.setup(app);

        if (!AppAnimation.getIsMobile())
            FooterBackgroundAnimation.setup(app);
        
        app.ticker.add(delta=> {
            ObjectsFallingAnimation.update();
            SkyAnimation.update(delta);

            if (!AppAnimation.getIsMobile())
                FooterBackgroundAnimation.update();
        })
    });
    
    return (
        <div class="sky-canvas" ref={ mergeRefs([ref]) } />
    );
};

export default BackgroundCanvas;