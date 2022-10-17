import { Store } from "solid-js/store"
import { MuxGetSet, SheetData, SheetGetSet } from "../types"

export function sort2(a: number, b: number): [number, number] {
	return a < b ? [a, b] : [b, a]
}

export function base26(x: number): string {
	let s = ""
	do {
		const r = x % 26
		s = String.fromCharCode(r + 65) + s
		x = Math.floor(x / 26)
	} while (x > 0)
	return s
}

export function getSheetGetSet(props: MuxGetSet): SheetGetSet {
	const pred = (s: Store<SheetData>) => s.id === props.get.selected
	// @ts-ignore - works
	const set = (...args: unknown[]) => props.set("sheets", pred, ...args)

	return {
		get: props.get.sheets.find(pred),
		set,
	}
}

export const TAB = "\t"
export const COMMA = ","
