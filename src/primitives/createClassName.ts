import { createEffect, createSignal } from "solid-js";

export default function createClassName(names: ()=> (string | false | undefined | null)[]): ()=> string {
    const [className, setClassName] = createSignal("");
    
    createEffect(()=> {
        setClassName(names().filter(Boolean).join(" "));
    })

    return className;
    // return names.filter(Boolean).join(" ");
}