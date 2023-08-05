import { onCleanup, onMount } from "solid-js";

export default function createLifecycle(callback: ()=> (()=> void) | undefined | null) {
    let unlisten = ()=> {};
    
    onMount(()=> {
        const returns = callback();
        if (returns)
            unlisten = returns;
    })
    onCleanup(()=> unlisten());
}