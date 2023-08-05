import HomePage from "./pages/HomePage";
import { createClassName } from "./primitives";
import AppAnimation from "./animations/AppAnimation";

const App: Solid.Component = () => {
    const className = createClassName(()=> [
        "app",
        AppAnimation.getIsMobile() && "mobile"
    ]);
    
    scrollTo(0, 0);
    
    addEventListener("DOMContentLoaded", ()=> {
        console.log("Loaded!")
    })
    
    return (
        <main class={ className() }>
            <HomePage />

            {/* <video src={ vhsOverlay_video } autoplay muted loop class="vhs-overlay" /> */}
        </main>
    );
};

export default App;