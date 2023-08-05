import * as PIXI from "pixi.js";
import hand_img from "../../assets/images/tape-hand/hand.png";
import arm_img from "../../assets/images/tape-hand/arm.png";
import SpriteGroup from "../../classes/SpriteGroup";
import AppAnimation from "../AppAnimation";

PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

export default class TapeHandAnimation {
    static app: PIXI.Application;
    
    static armGroup = new SpriteGroup();
    static handSprite = new PIXI.Sprite(PIXI.Texture.from(hand_img));
    static armSprite = new PIXI.Sprite(PIXI.Texture.from(arm_img));

    static time: number = 0;
    
    static setup(app: PIXI.Application) {
        this.app = app;

        this.armSprite.anchor.set(.5, 1);
        this.armSprite.scale.set(1.6);
        this.armSprite.position.set(app.view.width/2, app.view.height);

        this.handSprite.anchor.set(0.37, 0.91);
        this.handSprite.position.set(16, -125);

        this.armSprite.addChild(this.handSprite);
        this.armGroup.addChild(this.armSprite);
        app.stage.addChild(this.armGroup);
    }
    static update() {
        this.time ++;

        this.armSprite.angle = Math.sin(this.time / 14 * AppAnimation.timeScale) * 8;
        this.handSprite.angle = -Math.cos(this.time / 14 * AppAnimation.timeScale) * 8;
    }
}