import { createClassName } from "../../primitives";
import { MyComponent } from "../../types/component-types";

interface IBox extends MyComponent {}

const Box: Solid.Component<IBox> = props=> {
    const className = createClassName(()=> [
        "box",
        props.class
    ]);
    
    return (
        <div class={ className() } style={ props.style }>
            { props.children }
        </div>
    );
};

export default Box;