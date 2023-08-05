import * as PIXI from "pixi.js";
import Random from "../../utils/Random";
import { gsap } from "gsap";
import SpriteGroup from "../../classes/SpriteGroup";
import AppAnimation from "./../AppAnimation";
import rainbow_img from "../../assets/images/rainbow.png";
import { LARGE_CLOUDS_SOURCES, RAIN_PARTICLES_SOURCES, SMALL_CLOUDS_SOURCES } from "../../utils/Assets";

const CLEAR_SKY_COLOR = "#4474ce";
const RAINY_SKY_COLOR = "#a9a9af";

const darkenShaderFrag = /*glsl*/ `
    varying vec2 vTextureCoord;
    varying vec4 vColor;

    uniform sampler2D uSampler;
    uniform float uFactor;

    vec3 darkenColor = vec3(0.56078431372549019608, 0.56078431372549019608, 0.58823529411764705882);

    void main(void)
    {
        vec4 color = texture2D(uSampler, vTextureCoord);

        gl_FragColor = vec4(mix(color.rgb, darkenColor.rgb * color.a, uFactor), color.a);
    }
`;

PIXI.BaseTexture.defaultOptions.scaleMode = PIXI.SCALE_MODES.NEAREST;

export default class SkyAnimation {
    static app: PIXI.Application;
    static isMobile: boolean = false;
    
    static time: number = 0;
    static cloudsGroup = new SpriteGroup<Cloud>();
    static rainGroup = new SpriteGroup<RainParticle>();
    static rainbowSprite = PIXI.Sprite.from(rainbow_img);

    static rainFactor: number = 0;
    static cloudsDensity: number = Random.float(0, 1);

    static spawnCloudTimer: number = 10;
    static changeWeatherTimer: number = 10;

    static backgroundTween: gsap.core.Tween;
    
    static setup(app: PIXI.Application) {
        this.app = app;
        this.isMobile = AppAnimation.getIsMobile();

        if (!this.isMobile)
            this.rainFactor = Random.item([0, 1]);
        
        this.backgroundTween = gsap.to(document.body, {
            keyframes: [
                { background: CLEAR_SKY_COLOR },
                { background: RAINY_SKY_COLOR },
            ],
            duration: 1,
            ease: "none",
            paused: true
        });
        
        //
        this.spawnInitialClouds();
        this.startWeatherChangingTimer();
        
        app.stage.addChild(this.rainbowSprite);
        app.stage.addChild(this.cloudsGroup);
        app.stage.addChild(this.rainGroup);
    }
    static update(delta: number) {
        if (!AppAnimation.isPageLoaded) return;
        
        this.time += Math.floor(1 * AppAnimation.timeScale);
        
        const deltaSeconds = delta / 60 * AppAnimation.timeScale;
        this.spawnCloudTimer = Math.max(this.spawnCloudTimer - deltaSeconds, 0);
        if (!this.isMobile)
            this.changeWeatherTimer = Math.max(this.changeWeatherTimer - deltaSeconds, 0);

        this.rainbowSprite.alpha = (1 - this.getScrollProgress()/2) * .5 * (1 - Math.sqrt(this.rainFactor));
        this.cloudsGroup.alpha = 1 - this.getScrollProgress();

        this.rainbowSprite.x = -64;
        this.rainbowSprite.y = 160 - scrollY / 6;
        this.rainbowSprite.angle = -36;

        this.updateWeather();
        
        if (!this.isMobile) {
            this.updateRain();
            this.updateBackground();
        }
    }
    static updateWeather() {
        this.cloudsDensity = (Math.cos(this.time / 3000 * AppAnimation.timeScale + Math.PI)+1)/2;

        if (this.isMobile) return;
        
        if (this.changeWeatherTimer <= 0 && (!this.getIsRainStarted() || this.getIsRaining())) {
            if (!this.getIsRainStarted())
                this.startRain();
            else if (this.getIsRaining())
                this.stopRain();
        }
    }
    static updateRain() {
        if (this.rainFactor < .3) return;
        
        if (this.time % Math.max(Math.round((2 + 20 * (1-this.rainFactor)) / AppAnimation.timeScale), 1) == 0) {
            for (let i = 0; i < Math.max(Math.floor(1 * AppAnimation.timeScale * this.rainFactor), 1); i ++) {
                const rainParticle = new RainParticle();
                rainParticle.x = Random.float(0, this.app.view.width) - rainParticle.width;
                rainParticle.y = -rainParticle.height;
                
                this.rainGroup.addChild(rainParticle);
            }
        }
    }
    static updateBackground() {
        this.backgroundTween.seek(this.rainFactor);
    }
    
    //
    static startWeatherChangingTimer() {
        this.changeWeatherTimer = Random.float(40, 100);
    }
    static startRain() {
        if (this.rainFactor <= 0)
            this.rainFactor = 0.01;
        
        gsap.to(this, {
            rainFactor: 1,
            duration: 30 / AppAnimation.timeScale,
            ease: "none",
            onComplete: ()=> this.startWeatherChangingTimer()
        })
        console.log("It's starting to rain...");
    }
    static stopRain() {
        if (this.rainFactor >= 1)
            this.rainFactor = .99;
        
        gsap.to(this, {
            rainFactor: 0,
            duration: 40 / AppAnimation.timeScale,
            ease: "none",
            onComplete: ()=> {
                this.startWeatherChangingTimer();
                console.log("The rain is over. Is it good?");
            }
        })
    }
    
    //
    static spawnInitialClouds() {
        for (let i = 0; i < 20; i ++) {
            const cloud = this.spawnCloud();
            for (let frame = 0; frame < 60*60; frame ++) {
                cloud.update(true);
            }
        }
        this.startSpawningCloud();
    }
    static startSpawningCloud() {
        this.spawnCloud();
        
        const delay = Math.floor(1000 * (20 - 15 * this.cloudsDensity) / AppAnimation.timeScale);
        setTimeout(()=> {
            this.startSpawningCloud();
        }, delay);
    }

    static spawnCloud(): Cloud {
        const cloud = new Cloud();
        
        if (Random.bool()) {
            cloud.moveX = -cloud.width;
            cloud.moveY = Random.float(this.app.view.height/2, this.app.view.height*1.5);
        } else {
            cloud.moveX = Random.float(-cloud.width, this.app.view.width - cloud.width);
            cloud.moveY = this.app.view.height;
        }

        cloud.update();
        
        this.cloudsGroup.addChild(cloud);

        return cloud;
    }

    //
    static getIsRaining(): boolean {
        return this.rainFactor >= 1;
    }
    static getIsRainStarted(): boolean {
        return this.rainFactor > 0;
    }
    static getScrollProgress(): number {
        return scrollY / (innerHeight*2);
    }
}

//
class RainParticle extends PIXI.Sprite {
    speed: number = Random.float(1, 2);
    
    constructor() {
        super(PIXI.Texture.from(Random.item(RAIN_PARTICLES_SOURCES)));

        this.alpha = Random.float(.5, .8);
    }

    update() {
        if (!AppAnimation.isPageLoaded) return;
        
        this.x += 6 * this.speed * AppAnimation.timeScale;
        this.y += 26 * this.speed * AppAnimation.timeScale;
    }
    render(renderer: PIXI.Renderer): void {
        super.render(renderer);

        this.update();
        if (this.y > SkyAnimation.app.view.height)
            SkyAnimation.rainGroup.removeChild(this);
    }
}
class Cloud extends PIXI.Sprite {
    speed: number = Random.float(.02, .1);

    actualAlpha: number = 0;
    moveX: number = 0;
    moveY: number = 0;

    darkenFilter: PIXI.Filter = new PIXI.Filter(undefined, darkenShaderFrag);
    
    constructor() {
        const sources = [...LARGE_CLOUDS_SOURCES, ...SMALL_CLOUDS_SOURCES];
        super(PIXI.Texture.from(Random.item(sources)));
        
        this.scale.set(Random.float(1.6, 2));
        this.scale.set(this.scale.x * Random.sign(), this.scale.y * Random.sign());
        this.anchor.set(this.scale.x > 0 ? 1 : 0, this.scale.y > 0 ? 0 : 1);

        this.darkenFilter.uniforms
        this.filters = [this.darkenFilter];

        this.alpha = 0;
        this.actualAlpha = 0;
        gsap.to(this, {
            actualAlpha: Random.float(.4, .6),
            duration: 2 / AppAnimation.timeScale,
            ease: "none",
            onComplete: ()=> gsap.killTweensOf(this)
        });
    }
    
    update(ignorePageLoad: boolean=false) {
        if (!ignorePageLoad ? !AppAnimation.isPageLoaded : false) return;
        
        const scrollOffset = this.getScrollOffset();
        
        this.moveX += this.speed * AppAnimation.timeScale;
        this.moveY -= this.speed * AppAnimation.timeScale;
        
        this.x = Math.floor(this.moveX/.5)*.5;
        this.y = Math.floor((this.moveY + scrollOffset)/.5)*.5;

        this.alpha = this.actualAlpha * (1 + .5 * SkyAnimation.rainFactor);
        this.darkenFilter.uniforms.uFactor = SkyAnimation.rainFactor;
    }
    render(renderer: PIXI.Renderer): void {
        super.render(renderer);

        this.update();
        if (this.moveX-this.width > SkyAnimation.app.view.width || this.moveY+this.height < 0) {
            SkyAnimation.cloudsGroup.removeChild(this);
        }
    }

    getScrollOffset(): number {
        return -scrollY * (this.speed+.02)/.12*.1 * 4;
    }
}