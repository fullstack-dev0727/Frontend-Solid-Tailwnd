import { muxGetSet } from "../.."
import { CellData, SheetGetSet } from "../types"
import { getSheetGetSet, sort2 } from "./misc"

export function setCell(
	props: SheetGetSet,
	x: number,
	y: number,
	data: CellData
) {
	if (!props.get.rows[y]) {
		props.set("rows", y, { [x]: data })
	} else {
		props.set("rows", y, x, {
			...(props.get.rows?.[y]?.[x] ?? {}),
			...data,
		} as CellData)
	}
	props.get.onCellUpdate(x, y, data)
}

export function parseCSV(csv: string, delimiter: string) {
	return csv
		.trim()
		.split("\n")
		.map((r) =>
			r
				.trim()
				.split(delimiter)
				.map((c) => c.trim())
		)
}

export function setData(name: string, value: string) {

	const sheet = getSheetGetSet(muxGetSet);
	if (sheet) {
		for (let x = 0; x < 200; x++) {
			const content = sheet.get?.rows?.[0]?.[x]?.content
			console.log(content, name);
			if (content === name) {
				setCell(sheet, x, 1, { input: value, content: "" })
				break
			} else if (content) {
				continue
			} else {
				setCell(sheet, x, 0, { content: name })
				setCell(sheet, x, 1, { input: value, content: "" })
				break
			}
		}
	}
}

export function setText(
	props: SheetGetSet,
	x: number,
	y: number,
	csv: string,
	delimiter: string
) {
	const mat = parseCSV(csv, delimiter)
	for (let r = 0; r < mat.length; r++) {
		for (let c = 0; c < mat[r].length; c++) {
			setCell(props, x + c, y + r, { content: mat[r][c] })
		}
	}
}

export function getMat(
	props: SheetGetSet,
	x1: number,
	x2: number,
	y1: number,
	y2: number
) {
	const h = y2 - y1 + 1
	const w = x2 - x1 + 1
	const mat = new Array(h).fill(0).map(() => new Array(w))
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			mat[y][x] = props.get.rows[y + y1]?.[x + x1]?.content ?? ""
		}
	}
	return mat
}

export function getText(
	props: SheetGetSet,
	x1: number,
	x2: number,
	y1: number,
	y2: number,
	delimiter: string
) {
	const mat = getMat(props, x1, x2, y1, y2)
	return mat.map((r) => r.join(delimiter)).join("\n")
}

export function finiteSelectionY(props: SheetGetSet) {
	if (isFinite(props.get.selectionY)) return props.get.selectionY
	let y = 0
	for (const y_ in props.get.rows) y = Math.max(y, +y_)
	return y
}

export function finiteSelectionX(props: SheetGetSet) {
	if (isFinite(props.get.selectionX)) return props.get.selectionX
	let x = 0
	for (const k in props.get.rows) {
		for (const x_ in props.get.rows[k]) x = Math.max(x, +x_)
	}
	return x
}

export function getSelectionText(props: SheetGetSet, delimiter: string) {
	return getText(
		props,
		...sort2(props.get.selectedX, finiteSelectionX(props)),
		...sort2(props.get.selectedY, finiteSelectionY(props)),
		delimiter
	)
}

export function copySelectionText(props: SheetGetSet, delimiter: string) {
	navigator.clipboard.writeText(getSelectionText(props, delimiter))
}
