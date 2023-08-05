import { JSX } from "solid-js/jsx-runtime"

export interface MyComponentWithChildren {
    children?: JSX.Element
}
export interface MyComponent extends MyComponentWithChildren {
    class?: string
    style?: JSX.CSSProperties
}

export interface MyRef<T extends HTMLElement> {
    element: T | null
}