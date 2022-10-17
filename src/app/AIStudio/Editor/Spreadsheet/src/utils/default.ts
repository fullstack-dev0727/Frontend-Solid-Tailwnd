import { SheetData } from "../types"

export function createDefault(): SheetData {
	return {
		id: 0,
		name: "New Sheet",
		// scrolling
		scrollLeft: 0,
		scrollTop: 0,
		offsetLeft: 0,
		offsetTop: 0,
		scrollX: 0,
		scrollY: 0,
		realScrollLeft: 0,
		realScrollTop: 0,
		// selection
		focusing: false,
		selecting: false,
		selectedX: 0,
		selectedY: 0,
		selectionX: 0,
		selectionY: 0,
		// resize
		resizeX: -1,
		resizeY: -1,
		resize0: 0,
		size0: 0,
		// computed
		widths: [],
		heights: [],
		rowSizes: {},
		columnSizes: {},
		rows: {},
		defaultColumnSize: 200,
		defaultRowSize: 24,
		scrollHeight: 1e5,
		scrollWidth: 1e5,
		defaultCell: {
			content: "",
		},
		cellPre: () => null,
		onHeadMenu: () => {},
		onCellUpdate: () => {},
		cursors: [],
	}
}
