import { MyRef } from "../types/component-types";

export default function mergeRefs<T extends HTMLElement=HTMLDivElement>(refs: (MyRef<T> | ((el: T)=> void) | undefined | null)[]) {
    return (el: T)=> {
        if (!el) return;

        for (const ref of refs) {
            if (ref) {
                if (typeof ref == "function")
                    ref(el);
                else 
                    ref.element = el;
            }
        }
    }
}