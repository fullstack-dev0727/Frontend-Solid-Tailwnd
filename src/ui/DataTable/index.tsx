
import { batch, createEffect, createSignal, For, JSXElement } from "solid-js";
import { createStore } from "solid-js/store";
import { DataTableHeader, flipSortState, HeaderSortState } from "./dataHeader";
import { DataRowList } from "./dataRowList";

export interface DataTableHeaderInfo<T> {
    name: string,
    sort: (sortState: HeaderSortState, data: T[]) => T[],
    noResize?: boolean
}

export type DataTableHeaderResizeInfo = readonly number[];
export type ResolveData<T> = (item: T, resize: DataTableHeaderResizeInfo) => JSXElement;

/**
 * A generalized table which can be used for any kind of data. It allows for sorting each column,
 * resizing columns and selecting rows.
 * 
 * @example
 * ```tsx
 * const data = [{name: "Google", age: 33}, { name: "Tyler", age: 44 }];
 * 
 * <DataTable data={data} headers={[
 *  {
 *     name: "Name",
 *     sort: (sortState, people) => {
            if (sortState === HeaderSortState.SortingAscending) return [...people.sort((a, b) => b.name.localeCompare(a.name))];
            else return [...people.sort((a, b) => a.name.localeCompare(b.name))];
        },
 *  },
    {
        name: "Age",
        sort: ...
    }
 * ]} resolveData={(person) => {
 *    return <>
 *        <DataRowField>
 *          <p>{person.name}</p>
 *        </DataRowField>
 *        <DataRowField>
 *          <p>{person.age}</p>
 *        </DataRowField>
 *    </>
 * }}>
 * </DataTable>
 * ```
 */
export function DataTable<T>(props: {
    /**
     * The function is called when a file is dropped inside the table.
     */
    onFileDrop?: (file: File) => void,
    /**
     * The function is called when a file is dragged over the table.
     */
    onFileDragOver?: () => void,
    data: T[],
    headers: DataTableHeaderInfo<T>[],
    /**
     * Allows for items to remain at the top even after sorting.
     */
    filterUnsorted?: (item: T) => boolean,
    /**
     * Since this component is meant to be used for any kind of tables, the columns inside it
     * can vary - this will be called on every item in [[data]], and it's expected for the function
     * to return a [[JSXElement]].
     */
    resolveData: ResolveData<T>,
    onSelect?: (selected: T[]) => void,
    disableMultiSelect?: boolean,
    selected?: T[]
}) {
    const [currentlySelectedHeader, setCurrentlySelectedHeader] = createSignal(0);
    const [data, setData] = createSignal(props.data);
    const [sortState, setSortState] = createSignal(HeaderSortState.SortingDescending);
    const [resizeData, setResizeData] = createStore<DataTableHeaderResizeInfo>([]);

    createEffect(() => {
        // We are using an effect here because we want to re-sort everytime the `props.data` array
        // changes. 
        if (props.filterUnsorted) {
            const toBeSorted = [], unsorted = [];
            for (const item of props.data) {
                if (props.filterUnsorted(item)) unsorted.push(item);
                else toBeSorted.push(item);
            }
            setData([...unsorted, ...props.headers[currentlySelectedHeader()].sort(sortState(), toBeSorted)]);
        }
        else setData(props.headers[currentlySelectedHeader()].sort(sortState(), props.data));
    });

    return <div class="flex gap-2.5 flex-col px-6 min-w-[400px]" onDrop={(ev) => {
        ev.preventDefault();
        if (!ev.dataTransfer) return;
        for (let i = 0; i < ev.dataTransfer.files.length; i++) {
            const file = ev.dataTransfer.files[i];
            props.onFileDrop?.(file);
        }
    }} onDragOver={(ev) => {
        ev.preventDefault();
        props.onFileDragOver?.();
    }}>
        <div class="flex gap-2 border-y py-1.5">
            <For each={props.headers}>{(header, ind) => {
                return <DataTableHeader name={header.name} sortState={currentlySelectedHeader() === ind() ? sortState() : HeaderSortState.NotSelected} noResize={header.noResize} onClick={() => {
                    batch(() => {
                        if (currentlySelectedHeader() === ind()) {
                            setSortState(flipSortState(sortState()));
                        } else {
                            setCurrentlySelectedHeader(ind());
                            setSortState(HeaderSortState.SortingDescending);
                        }
                        setData(header.sort(sortState(), data()));
                    });
                }} onResize={(width) => {
                    setResizeData(ind(), width);
                }} />
            }}</For>
        </div>
        <DataRowList data={data()} resizeInfo={resizeData} resolveData={props.resolveData} onSelect={props.onSelect} disableMultiSelect={props.disableMultiSelect} selected={props.selected} />
    </div>
}

export function defaultStringSortingStartegy<T>(fieldName: keyof T) {
    return (sortState: HeaderSortState, things: T[]) => {
        if (sortState === HeaderSortState.SortingAscending) return things.slice().sort((a, b) => (b[fieldName] as unknown as string)?.localeCompare(a[fieldName] as unknown as string));
        else return things.slice().sort((a, b) => (a[fieldName] as unknown as string)?.localeCompare(b[fieldName] as unknown as string));
    }
}

export function defaultDateSortingStrategy<T>(fieldName: keyof T) {
    return (sortState: HeaderSortState, things: T[]) => { 
        if (sortState === HeaderSortState.SortingAscending) return [...things.sort((a, b) => new Date((a[fieldName] as unknown as string)).getTime() - new Date((b[fieldName] as unknown as string)).getTime())];
        else return [...things.sort((a, b) => new Date((b[fieldName] as unknown as string)).getTime() - new Date((a[fieldName] as unknown as string)).getTime())];
    }
}

export {
    HeaderSortState
};