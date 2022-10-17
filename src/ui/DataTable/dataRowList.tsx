import { createSignal, For, onCleanup } from "solid-js"
import { DataTableHeaderResizeInfo, ResolveData } from ".";
import { DataRow } from "./dataRow";

export function DataRowList<T>(props: {
    data: T[],
    resolveData: ResolveData<T>,
    resizeInfo: DataTableHeaderResizeInfo,
    onSelect?: (selected: T[]) => void,
    disableMultiSelect?: boolean,
    selected?: T[]
}) {
    const [selectedFiles, setSelectedFiles] = createSignal<T[]>(props.selected || []);
    let isLeftMouseClicked = false;

    const controller = new AbortController();

    window.addEventListener("mousedown", (e) => {
        if (e.button === 0) isLeftMouseClicked = true;
    }, { signal: controller.signal });

    window.addEventListener("mouseup", (e) => {
        if (e.button === 0) isLeftMouseClicked = false;
    }, { signal: controller.signal });

    onCleanup(() => controller.abort());

    return <div class="flex gap-0.5 flex-col">
            <For each={props.data}>{(data, ind) => {
                return <DataRow field={props.resolveData(data, props.resizeInfo)} selected={selectedFiles().some(sFile => sFile === data)} onClick={() => {
                    // If multiple files are currently selected, instead of removing all of them, make only the clicked
                    // file selected.
                    if (selectedFiles().length === 1 && selectedFiles().some(sFile => sFile === data)) setSelectedFiles([]);
                    else setSelectedFiles([data]);
                    props.onSelect(selectedFiles());
                }} onShiftClick={() => {
                    if (props.disableMultiSelect) return;
                    setSelectedFiles(props.data.slice(0, ind() + 1));
                    props.onSelect(selectedFiles());
                }} onMouseEnter={() => {
                    if (!isLeftMouseClicked || props.disableMultiSelect) return;
                    if (selectedFiles().some(sFile => sFile === data)) setSelectedFiles(selectedFiles().filter(f => f !== data));
                    else setSelectedFiles([...selectedFiles(), data]);
                    props.onSelect(selectedFiles());
                }} />
            }}</For>
        </div>
}