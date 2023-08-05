import { createSignal, onMount } from "solid-js";
import { createClassName } from "../primitives";
import AppAnimation from "../animations/AppAnimation";

const LOADER_SYMBOLS = ["|", "/", "-", "\\"];

const LoaderOverlay: Solid.Component = ()=> {
    const [loadPercent, setLoadPercent] = createSignal<number>(0);
    const [isLoaded, setIsLoaded] = createSignal<boolean>(false);
    const [loaderSymbolIndex, setLoaderSymbolIndex] = createSignal<number>(0);

    const loaderSymbol = ()=> LOADER_SYMBOLS[loaderSymbolIndex()];
    
    const className = createClassName(()=> [
        "loader-overlay",
        isLoaded() && "loaded"
    ]);
    
    onMount(()=> {
        addEventListener("DOMContentLoaded", ()=> {
            const images = document.images;
            let loadedCount = 0;

            Array.from(images).forEach((element, index)=> {
                element.onload = ()=> {
                    loadedCount ++;
                    setLoadPercent(Math.round(loadedCount / images.length * 100));

                    if (loadedCount >= images.length) {
                        setIsLoaded(true);
                        AppAnimation.isPageLoaded = true;
                    }
                }
            })
        });

        setInterval(()=> {
            setLoaderSymbolIndex(old=> {
                if (old + 1 >= LOADER_SYMBOLS.length)
                    return 0;
                
                return old + 1;
            })
        }, 40);
    });
    
    return (
        <div class={ className() }>
            <span class="vcr-text text-center weight-600">{ loaderSymbol() } { loadPercent() }%</span>
        </div>
    );
};

export default LoaderOverlay;