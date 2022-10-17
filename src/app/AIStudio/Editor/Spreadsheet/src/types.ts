import { Component, JSX } from "solid-js"
import { SetStoreFunction, Store } from "solid-js/store"

type OptionalAsync<T = void> = T | Promise<T>

export interface CellData {
	content: string
	url?: string
	input?: string
	style?: JSX.StyleHTMLAttributes<HTMLDivElement>
	class?: string
}

export interface CursorData {
	id: number
	name: string
	hue: number
	x: number
	y: number
}

export interface SheetData {
	id: number
	name: string
	rowSizes: Record<number, number>
	columnSizes: Record<number, number>
	defaultRowSize: number
	defaultColumnSize: number
	defaultCell: CellData
	rows: Record<number, Record<number, CellData>>
	// scrolling
	scrollHeight: number
	scrollWidth: number
	scrollLeft: number
	scrollTop: number
	offsetLeft: number
	offsetTop: number
	scrollX: number
	scrollY: number
	realScrollLeft: number
	realScrollTop: number
	// selection
	focusing: boolean
	selecting: boolean
	selectedX: number
	selectedY: number
	selectionX: number
	selectionY: number
	// resize
	resizeX: number
	resizeY: number
	resize0: number
	size0: number
	// computed
	widths: number[]
	heights: number[]

	// cell prefix component
	cellPre: Component<CellPreProps>

	// event
	onHeadMenu: (e: PointerEvent, x: number) => void
	onCellUpdate: (x: number, y: number, data: CellData) => void

	// other user cursors
	cursors: CursorData[]
}

export interface CellPreProps extends SheetGetSet {
	x: number
	y: number
	row: number
	column: number
	cellData: CellData
	selected: boolean
	selection: boolean
}

export interface SheetGetSet {
	get: Store<SheetData>
	set: SetStoreFunction<SheetData>
}

export interface MuxData {
	selected: number
	sheets: SheetData[]
	onSheetMenu: (e: PointerEvent, selected: number) => OptionalAsync
	onSheetAdd: (e: PointerEvent) => OptionalAsync<SheetData>
	onSheetRename: (selected: number, newName: string) => OptionalAsync<string>
}

export interface MuxGetSet {
	get: Store<MuxData>
	set: SetStoreFunction<MuxData>
}
