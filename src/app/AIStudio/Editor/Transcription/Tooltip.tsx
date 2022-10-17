import { Label } from "./Label"
import { Component, createEffect, createSignal } from "solid-js"
import { SegmentData } from "../types"
import { Segment } from "./Segment"

export const Tooltip: Component<SegmentData & { container: HTMLDivElement }> = (
	props
) => {
	let tooltip!: HTMLDivElement

	const [offset, setOffset] = createSignal(0)

	function computeAlignment() {
		setOffset(0)
		const { left, right } = props.container.getBoundingClientRect()
		const { left: left2, right: right2 } = tooltip.getBoundingClientRect()
		if (left2 < left) {
			setOffset(left - left2)
		} else if (right2 > right) {
			setOffset(right - right2)
		}
	}

	createEffect(computeAlignment)
	new ResizeObserver(computeAlignment).observe(props.container)

	return (
		<div
			ref={tooltip}
			class="focus-within:visible group-hover:visible hover:visible left-[50%] top-[90%] invisible absolute z-50"
			style={{
				transform: `translateX(calc(${offset()}px - 50%))`,
			}}
		>
			{/* <Label /> */}
			<Segment {...props} />
		</div>
	)
}
