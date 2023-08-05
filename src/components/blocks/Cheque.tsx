import { createClassName } from "../../primitives";
import { MyComponent } from "../../types/component-types";

interface ICheque extends MyComponent {}

const Cheque: Solid.Component<ICheque> = props=> {
    const className = createClassName(()=> [
        "cheque",
        props.class
    ]);
    
    return (
        <article class={ className() }>
            { props.children }
        </article>
    );
};

export const ChequeDivider: Solid.Component = ()=> {
    return (
        <div class="divider">--------------------------------------------------------</div>
    );
};

export default Cheque;