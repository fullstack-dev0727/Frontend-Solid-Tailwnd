import { Component, createSignal, JSX, onMount } from "solid-js"

export const SplitPane: Component<{
	upper: (total: number) => number
	lower: (total: number) => number
	left: JSX.Element
	right: JSX.Element
	vertical?: boolean
}> = (props) => {
	const [resizing, setResizing] = createSignal(false)
	const [paneSize, setPaneSize] = createSignal(700)

	let initialSize!: number
	let lastSize = paneSize()
	let container!: HTMLDivElement

	function getSize(e: MouseEvent) {
		if (props.vertical) return e.clientY
		return e.clientX
	}

	function beginResize(e: MouseEvent) {
		setResizing(true)
		initialSize = getSize(e)
		lastSize = paneSize()
	}

	onMount(() => {
		resize(1000)
	})

	function resize(delta: number) {
		const total = container.clientWidth
		setPaneSize(
			Math.min(
				Math.max(lastSize + delta, props.lower(total)),
				props.upper(total)
			)
		)
	}

	window.addEventListener("resize", () => resize(0))

	function mouseResize(e: MouseEvent) {
		if (resizing()) resize(getSize(e) - initialSize)
	}

	function endResize() {
		setResizing(false)
		lastSize = paneSize()
	}

	return (
		<div
			ref={container}
			class="grid w-full h-full"
			style={{
				[props.vertical
					? "grid-template-rows"
					: "grid-template-columns"]: `${paneSize()}px 5px auto`,
			}}
			classList={{
				"select-none cursor-col-resize": resizing(),
				"cursor-col-resize": resizing() && !props.vertical,
				"cursor-row-resize": resizing() && props.vertical,
			}}
			onMouseUp={endResize}
			onMouseMove={mouseResize}
		>
			{props.left}
			<div
				class="border-black/[0.08] bg-white hover:bg-black/[0.08] z-50"
				classList={{
					"bg-black/[0.08]": resizing(),
					"w-2 border-l-[1px] cursor-col-resize": !props.vertical,
					"w-full h-2 border-t-[1px] cursor-row-resize": props.vertical,
				}}
				onMouseDown={beginResize}
			/>
			{props.right}
		</div>
	)
}
