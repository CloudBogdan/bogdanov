import { onMount } from "solid-js";
import { createRef, mergeRefs } from "../../primitives";
import * as PIXI from "pixi.js";
import fontSheet_img from "../../assets/images/title-font-sheet.png";
import Random from "../../utils/Random";
import { gsap } from "gsap";

const CHAR_WIDTH = 40;
const CHAR_HEIGHT = 64;
const FONT_MAP = " abcdefghijklmnopqrstuvwxyz!?";

interface ICrazyTitle {
    text: string
}

const CrazyTitle: Solid.Component<ICrazyTitle> = props=> {
    const ref = createRef<HTMLDivElement>();

    onMount(()=> {
        const element = ref.element;
        if (!element) return;
        
        const text = props.text;
        const lines = text.toLowerCase().split("\n");
        const lineLength = Math.max(...lines.map(l=> l.length));

        const app = new PIXI.Application({
            width: (lineLength * CHAR_WIDTH) + 32*2 + CHAR_WIDTH,
            height: (lines.length * CHAR_HEIGHT) + 32*2 + CHAR_HEIGHT,
            backgroundAlpha: 0,
            antialias: false
        })
        element.style.maxWidth = app.view.width + "px";
        element.appendChild(app.view as any);
        
        const textX = app.view.width/2 - lineLength * CHAR_WIDTH/2 - CHAR_WIDTH/2;
        const textY = app.view.height/2 - lines.length * CHAR_HEIGHT/2;

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex ++) {
            const line = lines[lineIndex];

            for (let charIndex = 0; charIndex < line.length; charIndex ++) {
                const charSprite = new PIXI.TilingSprite(PIXI.Texture.from(fontSheet_img), 128, 128);
                charSprite.scale.set(.5);
                charSprite.tilePosition.x = -(FONT_MAP.indexOf(line[charIndex])) * 128;

                const charX = textX + charIndex * CHAR_WIDTH + Random.float(-8, 8);
                const charY = textY + lineIndex * CHAR_HEIGHT + Random.float(-8, 8);

                charSprite.x = charX + Random.float(-64, 64)
                charSprite.y = charY + Random.float(-64, 64)
                charSprite.alpha = 0;
                
                gsap.to(charSprite, {
                    keyframes: [
                        { alpha: 1, ease: "none", delay: .8 + charIndex*.05, duration: 0 },
                        { x: charX, y: charY, duration: .1, ease: "back.out" },
                    ]
                }, );
                
                app.stage.addChild(charSprite);
            }
        }

        let time = 0;
        function loop() {
            requestAnimationFrame(loop);
            time ++;

            if (time > Random.int(100, 600))
                time = 0;

            for (let i = 0; i < app.stage.children.length; i ++) {
                const charSprite = app.stage.children[i];
                if (!(charSprite instanceof PIXI.TilingSprite))
                    continue;

                charSprite.anchor.set(
                    Random.float(-1/128, 1/128) + Math.sin(time/6 + i)/128 + Math.cos(time/10 + i*2)/128, 
                    Random.float(-1/128, 1/128) + Math.cos(time/10 + i)/128 + Math.sin(time/20 + i*2)/128
                );

                charSprite.x = Math.floor(charSprite.x);
                charSprite.y = Math.floor(charSprite.y);
            }
        }
        loop();
    })
    
    return (
        <div class="crazy-title graphic" ref={ mergeRefs([ref]) } />
    );
};

export default CrazyTitle;