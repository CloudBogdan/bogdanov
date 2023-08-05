import FancyLink from "./buttons/FancyLink";
import FooterCanvas from "./canvases/FooterCanvas";
import table_gif from "../assets/images/table.gif";
import Logo from "./Logo";
import Box from "./blocks/Box";
import Window95 from "./blocks/Window95";

const Footer: Solid.Component = ()=> {
    return (
        <footer class="footer">
            <FooterCanvas />

            <div class="footer-contact row gap-4">
                <div class="col gap-2">
                
                    <Window95 title="Contacts" hideCloseButton>
                        <main class="window-content p-2 footer-links col gap-2">
                            <FancyLink text="github" to="https://github.com/CloudBogdan" />
                            <FancyLink text="telegram" to="https://t.me/bbogdan_ov" />
                            <FancyLink text="vk" to="https://vk.com/bbogdan_ov" />
                        </main>
                    </Window95>

                </div>

                
                <div class="col gap-2 items-end">
                    <Box class="variant-paper">
                        <div class="col gap-1">
                            <a href="mailto:bbogdanov_bog908@mail.ru">bbogdanov_bog908@mail.ru</a>
                            <span>discord@bogdan_ov</span>
                        </div>
                    </Box>
                    <Logo />
                </div>
            </div>
        </footer>
    );
};

export default Footer;