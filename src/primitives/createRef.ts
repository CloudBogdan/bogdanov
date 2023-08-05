import { MyRef } from "../types/component-types";

export default function createRef<T extends HTMLElement>(): MyRef<T> {
    return { element: null };
}