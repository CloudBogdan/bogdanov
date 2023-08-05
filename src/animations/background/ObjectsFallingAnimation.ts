import * as PIXI from "pixi.js";
import ImportUtils from "../../utils/ImportUtils";
import Random from "../../utils/Random";
import SpriteGroup from "../../classes/SpriteGroup";
import AppAnimation from "../AppAnimation";
import FramedSprite from "../../classes/FramedSprite";

export type FallingObjectName = "tape" | "clock" | "uno-red" | "uno-blue" | "disk" | "lighter" | "book" | "paper-piece" | "battery";

PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

export default class ObjectsFallingAnimation {
    static app: PIXI.Application;

    static time: number = 0;
    static objectsGroup = new SpriteGroup<FallingObject>();
    
    static setup(app: PIXI.Application) {
        this.app = app;
        app.stage.addChild(this.objectsGroup);
    }
    static update() {
        this.time += 1;

        this.updateObjects();
    }
    static updateObjects() {
        if (this.time % Math.round(Random.int(200, 220) / AppAnimation.timeScale) == 0)
        // if (this.time % Math.round(60 / AppAnimation.timeScale) == 0)
            this.spawnFallingObject();
    }

    static spawnFallingObject() {
        const names: FallingObjectName[] = ["clock", "tape", "uno-red", "uno-blue", "disk", "lighter", "book"];
        const object = new FallingObject(Random.item(names));

        object.moveX = -object.width;
        object.moveY = Random.float(0, this.app.view.height - object.height);
        object.update();
        
        this.objectsGroup.addChild(object);
    }
}

class FallingObject extends FramedSprite {
    moveX: number = 0;
    moveY: number = 0;

    speed: number = Random.float(2, 10);
    time: number = 0;
    
    constructor(name: FallingObjectName) {
        const path = ImportUtils.importImage(`/src/assets/images/objects/${ name }.png`);
        let width = 128;
        let height = 128;

        if (name == "tape")
            height = 256;
        else if (name == "book")
            height = 192;
        
        super(PIXI.Texture.from(path), width, height);

        this.frames = [0, 1, 2, 3, 4, 5, 6, 7];
        
        if (name == "disk")
            this.frames = [0, 1, 2, 3];

        this.anchor.set(.5);
        this.scale.set(Random.float(.6, 1.2));
    }

    update() {
        this.time += 1 * AppAnimation.timeScale;
        
        this.moveX += this.speed * AppAnimation.timeScale;

        const wave = Math.sin(this.time / 200 * this.speed) * this.speed * 8;

        this.x = Math.floor(this.moveX/.5) * .5;
        this.y = Math.floor((this.moveY + this.getScrollOffset() + wave)/.5) * .5;

        if (this.time % Math.floor(15 - this.speed) == 0) {
            this.updateAnimation();
            this.angle += 22.5;
        }
    }
    render(renderer: PIXI.Renderer): void {
        super.render(renderer);

        this.update();
        if (this.moveX-this.width > ObjectsFallingAnimation.app.view.width) {
            ObjectsFallingAnimation.objectsGroup.removeChild(this);
        }
    }

    getScrollOffset(): number {
        return -scrollY * this.speed / 12;
    }
}