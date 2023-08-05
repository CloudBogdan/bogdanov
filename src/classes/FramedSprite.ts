import * as PIXI from "pixi.js";

export default class FramedSprite extends PIXI.TilingSprite {
    frameIndex: number = 0;
    frames: number[] = [];
    
    constructor(texture: PIXI.Texture, width?: number, height?: number) {
        super(texture, width, height);
    }

    updateAnimation() {
        if (this.frames.length <= 0) return;
        
        const frame = this.frames[this.frameIndex];
        this.tilePosition.x = -frame * this.width;

        this.frameIndex ++;
        if (this.frameIndex >= this.frames.length)
            this.frameIndex = 0;
    }
}