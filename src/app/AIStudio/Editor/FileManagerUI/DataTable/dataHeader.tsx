import { onCleanup, Show } from "solid-js";
import { IconContainer } from "../IconContainer";

export const enum HeaderSortState {
    NotSelected,
    /**
     * The items **ascend**, so from Z -> A, 99 -> 1, etc.
     */
    SortingAscending,
    /**
     * The items **descend**, so from A -> Z, 1 -> 99, etc.
     */
    SortingDescending
}

const SortStateIcons = {
    // @ts-ignore TODO
    [HeaderSortState.NotSelected]: undefined,
    [HeaderSortState.SortingDescending]: <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M0.170229 0.158427C0.3972 -0.0528089 0.765193 -0.0528089 0.992165 0.158427L3.92748 2.89024C3.96753 2.92751 4.03247 2.92751 4.07252 2.89024L7.00784 0.158427C7.23481 -0.0528089 7.6028 -0.0528089 7.82977 0.158427C8.05674 0.369662 8.05674 0.712143 7.82977 0.923379L4.89446 3.65519C4.40046 4.11494 3.59954 4.11494 3.10554 3.65519L0.170229 0.923379C-0.0567428 0.712143 -0.0567428 0.369662 0.170229 0.158427Z" fill="black" fill-opacity="0.7" />
    </svg>,
    [HeaderSortState.SortingAscending]: <svg width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.82977 3.84157C7.6028 4.05281 7.23481 4.05281 7.00784 3.84157L4.07252 1.10976C4.03247 1.07249 3.96753 1.07249 3.92748 1.10976L0.992164 3.84157C0.765193 4.05281 0.3972 4.05281 0.170228 3.84157C-0.0567436 3.63034 -0.0567436 3.28786 0.170228 3.07662L3.10554 0.344811C3.59954 -0.114938 4.40046 -0.114936 4.89446 0.344812L7.82977 3.07662C8.05674 3.28786 8.05674 3.63034 7.82977 3.84157Z" fill="black" fill-opacity="0.9" />
    </svg>
}

export function flipSortState(state: HeaderSortState) {
    switch (state) {
        case HeaderSortState.SortingAscending: return HeaderSortState.SortingDescending;
        case HeaderSortState.SortingDescending: return HeaderSortState.SortingAscending;
        case HeaderSortState.NotSelected: return HeaderSortState.SortingDescending;
    }
}

export const DataTableHeader = (props: {
    name: string,
    /**
     * Removes the resize separator
     */
    noResize?: boolean,
    /**
     * If it's currently selected
     */
    sortState: HeaderSortState
    onClick: () => void,
    onResize: (width: number) => void
}) => {
    let divRef: HTMLDivElement | undefined;
    let separatorRef: HTMLDivElement | undefined;
    let isClicked = false;
    let originalWidth = 0;

    const controller = new AbortController();

    window.addEventListener("mousemove", (e) => {
        if (isClicked && separatorRef && divRef) {
            if (!originalWidth) originalWidth = Math.min(90, divRef.getBoundingClientRect().width);
            const separatorX = separatorRef.getBoundingClientRect().x;
            if (e.clientX >= separatorX) {
                const finalWidth = Math.round(divRef.getBoundingClientRect().width + (e.clientX - separatorX));
                if (finalWidth > 230) return;
                props.onResize(finalWidth);
                divRef.style.flex = `0 0 ${finalWidth}px`;
            } else {
                const finalWidth = Math.round(divRef.getBoundingClientRect().width - (separatorX - e.clientX));
                if (finalWidth < originalWidth) return;
                props.onResize(finalWidth);
                divRef.style.flex = `0 0 ${finalWidth}px`;
            }
        }
    }, { signal: controller.signal });

    window.addEventListener("click", () => isClicked = false, { signal: controller.signal });

    onCleanup(() => controller.abort());

    return <div class="flex gap-1 h-4 flex-[1_1_1px]" ref={divRef}>
        <div class={`flex flex-auto gap-1 cursor-pointer ${props.sortState === HeaderSortState.NotSelected ? "text-gray-500 hover:text-gray-700" : "text-black"}`} onClick={() => props.onClick()}>
            <p class="text-[13px] leading-4 w-full font-semibold select-none text-ellipsis whitespace-nowrap">{props.name}</p>
            <IconContainer>
                {SortStateIcons[props.sortState]}
            </IconContainer>
        </div>
        <Show when={!props.noResize}>
            <div ref={separatorRef} class="h-5 border-l border-2 cursor-ew-resize bg-gray-300" onMouseDown={(e) => {
                e.preventDefault();
                isClicked = true;
            }} onMouseUp={(e) => {
                e.preventDefault();
                isClicked = false;
            }}></div>
        </Show>
    </div>
}