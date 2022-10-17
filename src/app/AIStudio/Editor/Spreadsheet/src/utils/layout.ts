import { createEffect, createSignal } from "solid-js"
import { SheetGetSet } from "../types"

export function computeGridTemplate(
	i: number,
	length: number,
	sizes: Record<number, number>,
	defaultSize: number
) {
	let sum = 0
	const template: number[] = []
	while (sum < length) {
		const size = sizes[i++] ?? defaultSize
		sum += size
		template.push(size)
	}
	return template
}

export function template(sizes: readonly number[]) {
	return sizes.map((s) => s + "px").join(" ")
}

export function init(props: SheetGetSet, container: HTMLElement) {
	const [w, setW] = createSignal(container.clientWidth)
	const [h, setH] = createSignal(container.clientHeight)

	const observer = new ResizeObserver((entries) => {
		const [entry] = entries
		setW(entry.contentRect.width)
		setH(entry.contentRect.height)
		console.log(w(), h())
	})

	observer.observe(container)

	createEffect(() => {
		props.set(
			"widths",
			computeGridTemplate(
				props.get.scrollX,
				w(),
				props.get.columnSizes,
				props.get.defaultColumnSize
			)
		)
		props.set(
			"heights",
			computeGridTemplate(
				props.get.scrollY,
				h(),
				props.get.rowSizes,
				props.get.defaultRowSize
			)
		)
	})
}
