import { For, JSXElement } from "solid-js"


export const ContextMenu = (props: {
    width?: string,
    height?: string,
    top?: string,
    left?: string,
    class?: string,
    itemClass?: string,
    items: Array<{
        name: string,
        icon?: JSXElement,
        onClick?: () => void
    }>
}) => {
    return <div class={`absolute z-10 flex flex-col gap-1 p-2 rounded select-none bg-white context-menu ${props.class}`} style={{
        width: props.width || "150px",
        height: props.height || "auto",
        top: props.top || "25px",
        left: props.left || "35%"
    }}>
        <For each={props.items}>{(item) => {
            return <div class={`w-full rounded p-1 flex gap-2 cursor-pointer hover:bg-gray-200 transition-all duration-75 ${props.itemClass}`} onClick={item.onClick}>
                {item.icon}
                <p class="text-[13px] ">{item.name}</p>
            </div>
        }}</For>
    </div>
}