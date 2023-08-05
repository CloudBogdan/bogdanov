import { createClassName } from "../../primitives";
import { MyComponent } from "../../types/component-types";

interface IGif extends MyComponent {
    src: string
}

const Gif: Solid.Component<IGif> = props=> {
    const className = createClassName(()=> [
        "gif",
        props.class
    ]);
    
    return (
        <div class={ className() }>
            <img src={ props.src } />
        </div>
    );
};

export default Gif;