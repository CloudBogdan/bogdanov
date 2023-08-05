import Box from "../blocks/Box";
import Cheque, { ChequeDivider } from "../blocks/Cheque";
import Window95 from "../blocks/Window95";
import Section from "../page/Section";
import clock_gif from "../../assets/images/gifs/clock.gif";
import skull_gif from "../../assets/images/gifs/skull.gif";
import table_gif from "../../assets/images/gifs/table.gif";
import vcrWoman_gif from "../../assets/images/gifs/vcr-woman.gif";
import wow_gif from "../../assets/images/gifs/wow.gif";
import me_gif from "../../assets/images/gifs/me.gif";
import Gif from "../blocks/Gif";
import GameCanvas from "../canvases/GameCanvas";
import FancyLink from "../buttons/FancyLink";

const AboutSection: Solid.Component = ()=> {
    return (
        <Section class="container row flex-wrap-reverse items-end justify-center gap-4">
        
            <div class="col-centered gap-4 width-fill" style={{ flex: "1 0 0" }}>
                <Window95 title="I like, I hate...">
                    <code class="window-content" onClick={ ()=> alert("You don't have permissions to edit this!") }>
                        I like listening to music, I like pizza, I like winter, I like rain, I love my mom, I like javascript, I love your mom
                        <br /><br />
                        I hate spring, I hate noise, I hate hot weather, I hate the internet
                    </code>
                </Window95>
                
                <Window95 title="Gallery">
                    <main class="window-content gallery">
                        <Gif src={ table_gif } />
                        <Gif src={ skull_gif } />
                        <Gif src={ clock_gif } />
                        <Gif src={ vcrWoman_gif } />
                        <Gif src={ wow_gif } />
                        <Gif src={ me_gif } />
                    </main>
                </Window95>

                <Box class="variant-paper">
                    <div class="p-4">
                        <FancyLink horizontal text="Open source!" to="https://github.com/CloudBogdan/bogdanov" />
                    </div>
                </Box>
            </div>
        
            <div class="col-centered gap-4 width-fill" style={{ flex: "1 0 0" }}>

                <Cheque>
                    <h3 class="text-center">*** bogdanov ***</h3>
                    <ChequeDivider />
                    <div class="col">
                        <div class="row">
                            <span>*</span>&#160;
                            <p>I creating funny things such as games, maybe arts and not funny like websites and apps</p>
                        </div>
                        <span>&#160;</span>
                        <div class="row">
                            <span>*</span>&#160;
                            <p>I also programming almost every day. Often it's not something cool or serious, but I can just try or study something</p>
                        </div>
                        <span>&#160;</span>
                        <div class="row">
                            <span>*</span>&#160;
                            <p>98% of my projects are not finished, so I don't know what I can put into my portfolio</p>
                        </div>
                        <span>&#160;</span>
                        <div class="row">
                            <span>*</span>&#160;
                            <p>This site was created just for fun</p>
                        </div>
                    </div>
                    <ChequeDivider />
                    <div class="row-centered justify-between">
                        <p>* heart</p> <p>$40</p>
                    </div>
                    <div class="row-centered justify-between">
                        <p>* brain</p> <p>$120</p>
                    </div>
                    <div class="row-centered justify-between">
                        <p>* right eye</p> <p>$9.99</p>
                    </div>
                    <div class="row-centered justify-between">
                        <p>* left eye</p> <p>$4.99</p>
                    </div>
                    <ChequeDivider />
                    <div class="weight-600 row-centered justify-between">
                        <p>TOTAL</p> <p>$0.00</p>
                    </div>
                </Cheque>

                <Window95 title="TRASH EXTERMINATOR" class="game-window" hideCloseButton>
                    <main class="window-content col gap-1">
                        <Box class="variant-window">
                            <h3 class="text-center text-red">THROW TRASH AWAY</h3>
                        </Box>
                        <GameCanvas />
                    </main>
                </Window95>
                
            </div>
            
        </Section>
    );
};

export default AboutSection;