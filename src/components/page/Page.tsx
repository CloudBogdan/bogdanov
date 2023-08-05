import { createClassName } from "../../primitives";
import { MyComponent } from "../../types/component-types";

interface IPage extends MyComponent {}

const Page: Solid.Component<IPage> = props=> {
    const className = createClassName(()=> [
        "page",
        props.class
    ])
    
    return (
        <main class={ className() }>
            { props.children }
        </main>
    );
};

export default Page;