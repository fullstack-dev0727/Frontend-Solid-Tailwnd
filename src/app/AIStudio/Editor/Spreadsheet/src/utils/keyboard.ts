import {
	copySelectionText as copySelection,
	finiteSelectionX,
	finiteSelectionY,
	setCell,
} from "./data"
import { collapseSelection, shiftSelect } from "./selection"
import { SheetGetSet } from "../types"
import { sort2, TAB } from "./misc"

export function handleKeyDown(props: SheetGetSet, e: KeyboardEvent) {
	if (e.key.match(/F\d/)) return
	switch (e.key) {
		case "Tab":
			props.set("focusing", false)
			return shiftSelect(props, e, 1, 0, !e.shiftKey)
		case "ArrowUp":
			props.set("focusing", false)
			return shiftSelect(props, e, 0, -1, !e.shiftKey)
		case "Enter":
		case "ArrowDown":
			props.set("focusing", false)
			return shiftSelect(props, e, 0, 1, !e.shiftKey)
		case "Escape":
			props.set("focusing", false)
			return collapseSelection(props)
		case "Insert":
			return props.set("focusing", true)

		case "Shift":
		case "Control":
		case "Meta":
		case "Alt":
		case "ContextMenu":
			return
	}
	if (props.get.focusing) return
	if (e.ctrlKey || e.metaKey) {
		switch (e.key) {
			case "c":
				return copySelection(props, TAB)
		}
	}
	switch (e.key) {
		case "ArrowLeft":
			return shiftSelect(props, e, -1, 0, !e.shiftKey)
		case "Tab":
		case "ArrowRight":
			return shiftSelect(props, e, 1, 0, !e.shiftKey)
		case "Backspace":
		case "Delete": {
			const [y1, y2] = sort2(props.get.selectedY, finiteSelectionY(props))
			const [x1, x2] = sort2(props.get.selectedX, finiteSelectionX(props))
			for (let y = y1; y <= y2; y++) {
				for (let x = x1; x <= x2; x++) {
					setCell(props, x, y, { content: "" })
				}
			}
			return
		}
		case "Escape":
			return

		default:
			setCell(props, props.get.selectedX, props.get.selectedY, {
				content: "",
			})
			return props.set("focusing", true)
	}
}
