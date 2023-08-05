import { createClassName } from "../../primitives";
import { MyComponent } from "../../types/component-types";

interface ISection extends MyComponent {}

const Section: Solid.Component<ISection> = props=> {
    const className = createClassName(()=> [
        "section",
        props.class
    ]);
    
    return (
        <section
            class={ className() }
            style={ props.style }
        >
            { props.children }
        </section>
    );
};

export default Section;