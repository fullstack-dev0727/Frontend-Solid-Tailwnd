import { Accessor, createSignal, JSXElement } from "solid-js";

export const InlineNav = (props: {
    startAt: number,
    navigation: (navigate: (ind: number) => void, currentComponent: Accessor<JSXElement>, currentInd: Accessor<number>) => JSXElement,
    components: Array<JSXElement>
}) => {
    const [current, setCurrent] = createSignal<number>(props.startAt);
    return props.navigation((ind) => setCurrent(ind), () => props.components[current()], current);
}