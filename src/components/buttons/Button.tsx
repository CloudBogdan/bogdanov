import { createClassName } from "../../primitives";
import { MyComponent } from "../../types/component-types";

interface IButton extends MyComponent {
    onClick?: ()=> void
}

const Button: Solid.Component<IButton> = props=> {
    const className = createClassName(()=> [
        "button",
        props.class
    ]);
    
    return (
        <button
            class={ className() }
            
            onClick={ props.onClick } 
        >
            { props.children }
        </button>
    );
};

export default Button;