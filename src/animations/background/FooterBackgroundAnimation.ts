import * as PIXI from "pixi.js";
import SpriteGroup from "../../classes/SpriteGroup";
import dot_img from "../../assets/images/dot.png";
import { gsap } from "gsap";

const DOTS_GAP = 128;

PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

export default class FooterBackgroundAnimation {
    static app: PIXI.Application;

    static scrollOffset: number = 0;
    
    static group = new SpriteGroup();

    static setup(app: PIXI.Application) {
        this.app = app;

        const xCount = Math.round(app.view.width / DOTS_GAP)+1;
        const yCount = Math.round(app.view.height / DOTS_GAP / 2)*2+1;

        for (let y = 0; y < yCount; y ++) {
            for (let x = 0; x < xCount; x ++) {
                let offsetX = 0;
                if (y % 2 == 0)
                    offsetX = DOTS_GAP/2;
                
                const dot = new Dot(x * DOTS_GAP + offsetX, y * DOTS_GAP*.5 + innerHeight/2 + DOTS_GAP/2);
                this.group.addChild(dot);
            }
        }
        
        app.stage.addChild(this.group);
    }
    static update() {
        this.scrollOffset = (document.body.scrollHeight - innerHeight) - scrollY;
    }
}

class Dot extends PIXI.Sprite {
    moveX: number;
    moveY: number;
    
    constructor(x: number, y: number) {
        const texture = PIXI.Texture.from(dot_img);
        texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        
        super(texture);

        this.anchor.set(.5);
        this.scale.set(0);
        this.angle = 45;
        
        this.moveX = x;
        this.moveY = y;
        this.x = this.moveX;
        this.y = this.moveY;
    }

    update() {
        const offset = FooterBackgroundAnimation.scrollOffset
        const localFactor = gsap.utils.clamp(0, 1, 1 - (offset - this.y + innerHeight/2 + 60) / 100);
        const scale = localFactor * .74;
        
        this.x = this.moveX;
        this.y = this.moveY;
        this.scale.x += (scale - this.scale.x) * .5;
        this.scale.y += (scale - this.scale.y) * .5;
    }
    
    render(renderer: PIXI.Renderer): void {
        super.render(renderer);

        this.update();
    }
}