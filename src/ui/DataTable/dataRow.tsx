import { JSXElement, ParentProps } from "solid-js";

export const DataRow = (props: {
    field: JSXElement,
    selected?: boolean,
    onClick: () => void,
    onShiftClick: () => void,
    onMouseEnter: () => void
}) => {
    return <div class={`p-1 rounded cursor-pointer select-none transition-all duration-[100ms] ${props.selected ? "bg-gray-300" : "hover:bg-gray-200"}`} onMouseEnter={() => {
        props.onMouseEnter();
    }} onMouseDown={(e) => {
        if (e.button === 2) return;
        if (e.shiftKey) props.onShiftClick();
        else props.onClick();
    }}>
        {props.field}
    </div>
}

export const DataRowWrapper = (props: ParentProps<{}>) => {
    return <div class="flex gap-3">
        {props.children}
    </div>
}

/**
 * Automatically handles resizing of the row - it's not necessary to use it.
 */
export const DataRowField = (props: ParentProps<{
    resize?: number,
    class?: string
}>) => {
    return <div class={props.class} style={{
        flex: props.resize ? `0 0 ${props.resize - 4}px` : "1 1 0"
    }}>
        {props.children}
    </div>
}


export const StyledRowField = (props: ParentProps<{
    resize?: number,
    class?: string
}>) => {
    return <div class={"whitespace-nowrap overflow-hidden text-ellipsis min-w-[90px]" + ` ${props.class || ""}`} style={{
        flex: props.resize ? `0 0 ${props.resize - 4}px` : "1 1 0"
    }}>
        <div class="flex text-[13px] leading-4 font-medium text-gray-700 min-w-0">
            <span class="whitespace-nowrap overflow-hidden text-ellipsis">{props.children}</span>
        </div>
    </div>
}