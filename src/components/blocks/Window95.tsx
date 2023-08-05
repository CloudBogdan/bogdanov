import { Show } from "solid-js";
import { createClassName } from "../../primitives";
import { MyComponent } from "../../types/component-types";
import Button from "../buttons/Button";

interface IWindow95 extends MyComponent {
    title?: string
    hideCloseButton?: boolean
}

const Window95: Solid.Component<IWindow95> = props=> {
    const className = createClassName(()=> [
        "window-95 box variant-window",
        props.class
    ]);
    
    return (
        <article class={ className() }>
            <header class="window-header">
                <Show when={ !!props.title } fallback={ <span></span> }>
                    <span class="window-title">{ props.title }</span>
                </Show>
                <Show when={ !props.hideCloseButton }>
                    <Button class="smile" />
                </Show>
            </header>
            { props.children }
        </article>
    );
};

export default Window95;