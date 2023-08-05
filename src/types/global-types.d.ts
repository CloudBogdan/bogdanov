import type { Component as TComponent, JSX as tJSX } from "solid-js";

declare global {
    namespace Solid {
        type Component<T={}> = TComponent<T>;
    }
}