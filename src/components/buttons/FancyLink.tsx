import pointer_img from "../../assets/images/ui/pointer.png";
import { createClassName } from "../../primitives";
import { MyComponent } from "../../types/component-types";

interface IFancyLink extends MyComponent {
    text: string
    to: string
    horizontal?: boolean
}

const FancyLink: Solid.Component<IFancyLink> = props=> {
    const className = createClassName(()=> [
        "fancy-link",
        props.horizontal && "horizontal",
        props.class
    ]);
    
    return (
        <a class={ className() } href={ props.to } data-text={ props.text } target="_blank">
            <div>{ props.text }</div>

            <img src={ pointer_img } class="pointer" />
        </a>
    );
};

export default FancyLink;