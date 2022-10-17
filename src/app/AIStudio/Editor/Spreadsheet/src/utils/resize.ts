import { SheetGetSet } from "../types";

export function isResizingX(props: SheetGetSet) {
	return props.get.resizeX >= 0;
}

export function isResizingY(props: SheetGetSet) {
	return props.get.resizeY >= 0;
}

export function stopResizing(props: SheetGetSet) {
	props.set("resizeX", -1);
	props.set("resizeY", -1);
}
