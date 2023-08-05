import * as PIXI from "pixi.js";

export default class SpriteGroup<T extends PIXI.Sprite=PIXI.Sprite> extends PIXI.Container<T> {
    constructor() {
        super();
    }

    render(renderer: PIXI.Renderer): void {
        if (!this.visible || this.worldAlpha <= 0 || !this.renderable)
            return;

        if (this._mask || this.filters?.length)
            this.renderAdvanced(renderer);
        else if (this.cullable)
            this._renderWithCulling(renderer);
        else {
            this._render(renderer);

            for (const child of this.children) {
                if (!!child)
                    child.render(renderer);
            }
        }
    }

    removeChild<U extends T[]>(...children: U): U[0] {
        for (const child of children) {
            // @ts-ignore
            this.children = this.children.filter(c=> c != child);
        }
    
        return children[0];
    }
}