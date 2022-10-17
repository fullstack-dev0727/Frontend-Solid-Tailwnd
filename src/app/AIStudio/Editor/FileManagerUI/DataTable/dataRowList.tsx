import { createSignal, For, onCleanup } from "solid-js"
import { DataTableHeaderResizeInfo, ResolveData } from ".";
import { DataRow } from "./dataRow";


export function DataRowList<T>(props: {
    data: T[],
    resolveData: ResolveData<T>,
    resizeInfo: DataTableHeaderResizeInfo
}) {
    const [selectedFiles, setSelectedFiles] = createSignal<T[]>([]);
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
            // TODO: as any because this table is generic
            return <DataRow file={data as any} field={props.resolveData(data, props.resizeInfo)} selected={selectedFiles().some(sFile => sFile === data)} onClick={() => {
                // If multiple files are currently selected, instead of removing all of them, make only the clicked
                // file selected.
                if (selectedFiles().length === 1 && selectedFiles().some(sFile => sFile === data)) setSelectedFiles([]);
                else setSelectedFiles([data]);
            }} onShiftClick={() => {
                setSelectedFiles(props.data.slice(0, ind() + 1));
            }} onMouseEnter={() => {
                if (!isLeftMouseClicked) return;
                if (selectedFiles().some(sFile => sFile === data)) setSelectedFiles(selectedFiles().filter(f => f !== data));
                else setSelectedFiles([...selectedFiles(), data]);
            }} />
        }}</For>
    </div>
}