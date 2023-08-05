import * as PIXI from "pixi.js";
import FramedSprite from "../classes/FramedSprite";
import SpriteGroup from "../classes/SpriteGroup";
import ImportUtils from "../utils/ImportUtils";
import { FallingObjectName } from "../animations/background/ObjectsFallingAnimation";
import Random from "../utils/Random";
import vcr_font from "../assets/fonts/vcr.ttf";

const decayShaderFrag = /*glsl*/ `
    varying vec2 vTextureCoord;
    varying vec4 vColor;

    uniform sampler2D uSampler;
    uniform float uFactor;

    vec3 decayColor = vec3(0.0, 0.0, 0.0);

    float rand(vec2 n) { 
        return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }

    void main(void)
    {
        vec2 uv = vTextureCoord;
        vec4 color = texture2D(uSampler, uv);

        float a = step(1. - uFactor * 2., color.a * rand(uv));
        
        gl_FragColor = vec4(mix(color.rgb, decayColor.rgb, a), color.a);
    }
`;

PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

export default class Game {
    static app: PIXI.Application;

    static score: number = 500;
    static mousePos = new PIXI.Point(0, 0);
    static time: number = 0;
    static spawnTime: number = 0;
    static spawnSpeed: number = 1;

    static isPaused: boolean = true;
    static isGameOver: boolean = false;

    static scoreText: PIXI.Text;
    static clickToPlayText: PIXI.Text;
    static enemiesGroup = new SpriteGroup<Enemy>();
    
    static setup(app: PIXI.Application) {
        this.app = app;

        if (app.view.addEventListener) {
            app.view.addEventListener("pointerdown", ()=> {
                this.isPaused = false;
            })
        }

        app.stage.addChild(this.enemiesGroup);
        
        PIXI.Assets.add("vcr-font", vcr_font);
        PIXI.Assets.load("vcr-font").then(()=> {
            this.scoreText = new PIXI.Text(this.score.toString(), {
                fontFamily: "VCR",
                fontSize: 32,
                fill: "#fff",
                stroke: '#00f',
                strokeThickness: 4,
            });
            this.clickToPlayText = new PIXI.Text("CLICK TO PLAY", {
                fontFamily: "Comic",
                fontSize: 32,
                fill: "#fff",
                stroke: '#000',
                strokeThickness: 10,
            });

            this.scoreText.anchor.x = .5;
            this.scoreText.x = this.width/2;
            this.scoreText.y = 10;

            this.clickToPlayText.anchor.set(.5);
            this.clickToPlayText.x = this.width/2;
            this.clickToPlayText.y = this.height/2;

            app.stage.addChild(this.scoreText);
            app.stage.addChild(this.clickToPlayText);
        })
        
        addEventListener("pointerup", ()=> {
            if (this.getIsPause()) return;
            
            for (const child of this.enemiesGroup.children) {
                if (child.isDragging) {
                    child.isDragging = false;
                }
            }
        });
        addEventListener("pointermove", e=> {
            if (!app.view.getBoundingClientRect || this.getIsPause()) return;
            
            const bounds = app.view.getBoundingClientRect() as DOMRect;

            this.mousePos.set(
                (e.clientX - bounds.left) / bounds.width * this.width,
                (e.clientY - bounds.top) / bounds.height * this.height,
            );
        })
        addEventListener("scroll", ()=> {
            this.isPaused = true;
        })
    }
    static update(delta: number) {
        this.time ++;
        this.spawnSpeed = Math.min(Math.sqrt(this.time) / 10, 9);
        this.spawnTime += delta / 60 * this.spawnSpeed;
        
        this.updateEnemiesSpawning();

        if (this.scoreText && this.clickToPlayText) {
            this.clickToPlayText.visible = this.isPaused;
            this.scoreText.visible = !this.clickToPlayText.visible;
            this.scoreText.text = this.score.toString();
        }

        if (this.isGameOver && this.enemiesGroup.children.length <= 0) {
            this.isGameOver = false;
            this.score = 500;
            this.time = 0;
            this.spawnTime = 0;
            this.spawnSpeed = 1;
        }
    }

    static updateEnemiesSpawning() {
        if (this.getIsPause()) return;
        
        if (this.spawnTime > 3) {
            const names: FallingObjectName[] = ["clock", "tape", "uno-red", "uno-blue", "disk", "lighter", "book", "paper-piece", "battery"];
            const enemy = new Enemy(Random.item(names));

            enemy.moveX = Random.float(0, this.app.view.width - enemy.width);
            enemy.moveY = -enemy.height;
            enemy.update();

            this.enemiesGroup.addChild(enemy);

            this.spawnTime = 0;
        }
    }

    static addScore(score: number) {
        if (this.score <= 0) return;
        
        this.score += score;
        if (this.score <= 0) {
            this.isGameOver = true;
        }
    }

    // Get
    static getIsPause(): boolean {
        return this.isPaused || this.isGameOver;
    }
    static get width(): number {
        return this.app.view.width;
    }
    static get height(): number {
        return this.app.view.height;
    }
}

class Enemy extends FramedSprite {
    moveX: number = 0;
    moveY: number = 0;
    velX: number = 0;
    velY: number = 0;
    actualScale: number = Random.float(.5, 1);

    speed: number = Random.float(.2, .8);
    time: number = 0;
    
    isOnScreen: boolean = false;
    isDragging: boolean = false;
    lifeTime: number = 60*10;

    decayFilter = new PIXI.Filter(undefined, decayShaderFrag, { uFactor: 0 });
    
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
        else if (name == "paper-piece")
            this.frames = [0, 1, 2, 3, 4, 5];
        else if (name == "battery")
            this.frames = [0, 1, 2, 3];

        this.filters = [this.decayFilter];

        this.velX = Random.float(-20, 20);
            
        this.eventMode = "static";
        this.anchor.set(.5);
        this.scale.set(this.actualScale);
        this.angle = Math.floor(Random.float(0, 360) / 22.5) * 22.5;

        this.on("pointerdown", ()=> {
            if (Game.getIsPause()) return;
            
            this.isDragging = true
        });
    }

    update() {
        if (!Game.isPaused)
            this.time += 1;
        
        this.updateDragging();
        this.updatePhysics();
        this.updateBounds();

        this.x = Math.floor(this.moveX);
        this.y = Math.floor(this.moveY);

        if (!Game.getIsPause() && this.time % Math.floor(15 - this.speed) == 0) {
            this.updateAnimation();
        }

        if (this.isOnScreen && this.moveY + this.height/2 < 0) {
            this.destroy();
            Game.addScore(25);
        }
        if (!this.isOnScreen && this.moveY + this.height/2 > 0)
            this.isOnScreen = true;

        if (Game.isGameOver && this.time < this.lifeTime*.5)
            this.time = this.lifeTime*.5;

        this.decayFilter.uniforms.uFactor = Math.max((this.time - this.lifeTime*.5) / (this.lifeTime*.5), 0);

        if (this.time > this.lifeTime - 150) {
            this.destroy();
            Game.addScore(-200);
        }
    }
    updateDragging() {
        if (Game.getIsPause()) return;
        if (!this.isDragging) return;

        this.velX = (Game.mousePos.x - this.moveX) / 2;
        this.velY = (Game.mousePos.y - this.moveY) / 2;
    }
    updatePhysics() {
        if (Game.getIsPause()) return;
        
        if (!this.isDragging) {
            this.velY += 1;
        }

        this.moveX += this.velX;
        this.moveY += this.velY;
        this.velX *= .99;
        this.velY *= .99;
    }
    updateBounds() {
        if (this.moveX + this.width/2 * this.scale.x > Game.width) {
            this.moveX = Game.width - this.width/2 * this.scale.x;

            if (!this.isDragging) {
                this.angle += 22.5;
                this.velX *= -.95;
            } else {
                this.velX = 0;
            }
        }
        if (this.moveX - this.width/2 * this.scale.x < 0) {
            this.moveX = this.width/2 * this.scale.x;

            if (!this.isDragging) {
                this.angle += 22.5;
                this.velX *= -.95;
            } else {
                this.velX = 0;
            }
        }

        if (this.moveY + this.height/2 * this.scale.y > Game.height) {
            this.moveY = Game.height - this.height/2 * this.scale.y;
            
            if (!this.isDragging)
                this.velY *= -.95;
            else
                this.velY = 0;
        }
    }

    render(renderer: PIXI.Renderer): void {
        super.render(renderer);

        this.update();
    }

    //
    destroy() {
        Game.enemiesGroup.removeChild(this);
    }
}