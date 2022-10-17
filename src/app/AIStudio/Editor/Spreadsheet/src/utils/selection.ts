import { StoreSetter } from "solid-js/store";
import { setScrollX, setScrollY } from "./scroll";
import { SheetGetSet } from "../types";

export function setSelected(
	props: SheetGetSet,
	x: StoreSetter<number, ["selectedX"]>,
	y: StoreSetter<number, ["selectedY"]>
) {
	props.set("selectedX", x);
	props.set("selectedY", y);
}

export function setSelection(
	props: SheetGetSet,
	x: StoreSetter<number, ["selectionX"]>,
	y: StoreSetter<number, ["selectionY"]>
) {
	props.set("selectionX", x);
	props.set("selectionY", y);
}

export function collapseSelection(props: SheetGetSet) {
	setSelection(props, props.get.selectedX, props.get.selectedY);
}

export function shiftSelect(
	props: SheetGetSet,
	e: Event,
	dx: number,
	dy: number,
	collapse = true
) {
	e.preventDefault();
	setSelected(
		props,
		(x) => Math.max(0, x + dx),
		(y) => Math.max(0, y + dy)
	);
	
	if (props.get.selectedX < props.get.scrollX) {
		setScrollX(props, props.get.selectedX);
	} else if (
		props.get.selectedX >
		props.get.scrollX + props.get.widths.length - 2
	) {
		setScrollX(
			props,
			props.get.selectedX - props.get.widths.length + 2
		);
	}
	
	if (props.get.selectedY < props.get.scrollY) {
		setScrollY(props, props.get.selectedY);
	} else if (
		props.get.selectedY >
		props.get.scrollY + props.get.heights.length - 3
	) {
		setScrollY(
			props,
			props.get.selectedY - props.get.heights.length + 3
		);
	}

	if (collapse) collapseSelection(props);
}

export function isInRange(x: number, a: number, b: number) {
	return (a <= x && x <= b) || (a >= x && x >= b);
}

export function isInSelection(props: SheetGetSet, x: number, y: number) {
	return (
		isInRange(x, props.get.selectedX, props.get.selectionX) &&
		isInRange(y, props.get.selectedY, props.get.selectionY)
	);
}

export function isSelected(props: SheetGetSet, x: number, y: number) {
	return y === props.get.selectedY && x === props.get.selectedX;
}

export function startSelecting(props: SheetGetSet) {
	props.set("selecting", true);
}

export function stopSelecting(props: SheetGetSet) {
	props.set("selecting", false);
}
