import { JSX, ParentProps } from "solid-js"


export const Scrollable = (props: ParentProps<{
    visibleStyle?: JSX.CSSProperties,
    onScrollEnd?: () => void
}>) => {
    return <div class="overflow-auto invisible styled-scrollbar hover:visible" onScroll={(ev) => {
        const el = ev.target as HTMLElement;
        if (Math.ceil(el.offsetHeight + el.scrollTop) >= el.scrollHeight) props.onScrollEnd?.();
    }}>
        <div class="visible" style={props.visibleStyle}>
            {props.children}
        </div>
    </div>
}