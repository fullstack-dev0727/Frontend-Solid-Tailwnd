import { Component, onMount } from "solid-js"
import { SheetGetSet } from "../types"
import { handleKeyDown } from "../utils/keyboard"
import { Body } from "./Body"
import { Head } from "./Head"
import { Side } from "./Side"
import { setSelected, setSelection, stopSelecting } from "../utils/selection"
import { isResizingX, isResizingY, stopResizing } from "../utils/resize"
import { init } from "../utils/layout"
import { styles } from "../styles"

export const Sheet: Component<SheetGetSet> = (props) => {
	let container!: HTMLDivElement

	onMount(() => {
		init(props, container)
	})

	onMount(() => {
		globalThis.addEventListener("keydown", (e) => {
			if (container.querySelector(":hover")) {
				handleKeyDown(props, e)
			}
		})
	})

	return (
		<div
			onPointerUp={() => {
				stopSelecting(props)
				stopResizing(props)
			}}
			ref={container}
			onPointerMove={(e) => {
				if (isResizingX(props)) {
					props.set(
						"columnSizes",
						props.get.resizeX,
						Math.max(e.x - props.get.resize0 + props.get.size0, 25)
					)
				}
			}}
			style={{
				width: "100%",
				height: "100%",
				position: "relative",
				"user-select": "none",
				display: "flex",
				cursor: isResizingX(props)
					? "col-resize"
					: isResizingY(props)
					? "row-resize"
					: "auto",
				"font-size": "13px",
			}}
		>
			<div />
			<div
				style={{
					display: "grid",
					overflow: "hidden",
					"grid-template-rows": "auto auto",
					"grid-template-columns": "auto auto",
				}}
			>
				<div
					style={{
						background:
							isFinite(props.get.selectionX) || isFinite(props.get.selectionY)
								? styles.normal.border
								: "white",
					}}
					onPointerDown={() => {
						setSelected(props, 0, 0)
						setSelection(props, Infinity, Infinity)
					}}
				/>
				<Head {...props} />
				<Side {...props} />
				<Body {...props} />
			</div>
		</div>
	)
}
