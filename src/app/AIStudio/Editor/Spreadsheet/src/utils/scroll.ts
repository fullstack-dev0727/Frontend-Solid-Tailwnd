import { SheetGetSet } from "..";

export function setScrollX(props: SheetGetSet, x: number) {
	props.set("scrollX", Math.max(0, x));
}

export function setScrollY(props: SheetGetSet, y: number) {
	props.set("scrollY", Math.max(0, y));
}

export function setScroll(props: SheetGetSet, x: number, y: number) {
	setScrollX(props, x);
	setScrollY(props, y);
}

export function scrollBy(props: SheetGetSet, dx: number, dy: number) {
	setScroll(props, props.get.scrollX + dx, props.get.scrollY + dy);
}

function handleScrollY(props: SheetGetSet, y: number) {
	let sum = 0;
	let next = 0;
	let i = 0;
	let inc = 0;
	while (sum + next < y) {
		sum += next;
		i += inc;
		next = props.get.rowSizes[i] ?? props.get.defaultRowSize;
		inc = 1;
	}
	props.set("scrollY", i);
	props.set("scrollTop", sum);
	props.set("offsetTop", sum - y);
}

// export function handleScrollY(props: Props, y: number) {
// 	const sizes = Object.keys(props.data.rowSizes)
// 		.map((k) => +k)
// 		.sort((a, b) => a - b);
// 	let sum = 0;
// 	console.log(sizes)
// }

function handleScrollX(props: SheetGetSet, x: number) {
	let sum = 0;
	let next = 0;
	let i = 0;
	let inc = 0;
	while (sum + next < x) {
		sum += next;
		i += inc;
		next = props.get.columnSizes[i] ?? props.get.defaultColumnSize;
		inc = 1;
	}
	props.set("scrollX", i);
	props.set("scrollLeft", sum);
	props.set("offsetLeft", sum - x);
}

export function handleScroll(props: SheetGetSet, x: number, y: number) {
	props.set("focusing", false);
	handleScrollX(props, x);
	handleScrollY(props, y);
	props.set("realScrollLeft", x);
	props.set("realScrollTop", y);
}
