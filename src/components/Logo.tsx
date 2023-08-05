import logo_img from "../assets/images/logo.png";

const Logo: Solid.Component = ()=> {
    return (
        <a href="https://vk.com/bbogdan_ov" target="_blank" class="logo">
            <img src={ logo_img } />
        </a>
    );
};

export default Logo;