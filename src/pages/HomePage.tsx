import Footer from "../components/Footer";
import LoaderOverlay from "../components/LoaderOverlay";
import BackgroundCanvas from "../components/canvases/BackgroundCanvas";
import AboutSection from "../components/home-page/AboutSection";
import SpeedControlButtons from "../components/home-page/SpeedControlButtons";
import WelcomeSection from "../components/home-page/WelcomeSection";
import Page from "../components/page/Page";

const HomePage: Solid.Component = ()=> {
    return (
        <Page class="home-page">
            <BackgroundCanvas />

            <WelcomeSection />
            <AboutSection /> 
            <Footer />

            <SpeedControlButtons />

            <LoaderOverlay />
        </Page>
    );
};

export default HomePage;