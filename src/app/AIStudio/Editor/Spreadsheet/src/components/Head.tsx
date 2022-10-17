import { Component, For } from "solid-js"
import { styles } from "../styles"
import { SheetGetSet } from "../types"
import {
	isInRange,
	setSelected,
	setSelection,
	startSelecting,
	template,
	base26,
} from "../utils"

export const Head: Component<SheetGetSet> = (props) => {
	return (
		<div style={{ overflow: "hidden" }}>
			<div
				style={{
					display: "grid",
					"margin-left": props.get.offsetLeft + "px",
					overflow: "hidden",
					"grid-template-rows": props.get.defaultRowSize + "px",
					"grid-template-columns": template(props.get.widths),
					"z-index": Number.MAX_SAFE_INTEGER,
				}}
			>
				<For each={props.get.widths}>
					{(_, i) => {
						const x = () => props.get.scrollX + i()
						const selection = () =>
							isInRange(x(), props.get.selectedX, props.get.selectionX)
						const selected = () =>
							selection() && !isFinite(props.get.selectionY)
						const resizing = () => props.get.resizeX === x()
						const title = () => props.get.rows[0]?.[x()]?.content || base26(x())
						return (
							<div
								onPointerOver={(e) => {
									e.preventDefault()
									if (props.get.selecting) setSelection(props, x(), Infinity)
								}}
								style={{
									display: "flex",
									"margin-left": "-1px",
									"z-index": 100,
									background: selected()
										? styles.active.border
										: selection()
										? styles.highlight.bg
										: "white",
									border: `1px ${styles.normal.border} solid`,
									color: selected() ? "white" : "black",
								}}
							>
								<div
									onPointerDown={(e) => {
										e.preventDefault()
										startSelecting(props)
										setSelected(props, x(), 0)
										setSelection(props, x(), Infinity)
									}}
									title={title()}
									style={{
										"justify-content": "center",
										"align-items": "center",
										display: "flex",
										"flex-grow": 1,
										"white-space": "nowrap",
										"text-overflow": "ellipsis",
										overflow: "hidden",
									}}
								>
									{title()}
								</div>
								<div
									style={{
										"align-items": "center",
										display: "flex",
										padding: "5px",
									}}
								>
									<div
										onPointerDown={(e) => props.get.onHeadMenu(e, x())}
										style={{
											"border-color": selected() ? "white" : "grey",
											"border-width": "0px 1px 1px 0px",
											"border-style": "solid",
											width: "6px",
											height: "6px",
											cursor: "pointer",
											transform: "rotate(45deg) translateY(-3px)",
										}}
									/>
								</div>
								<div
									onPointerDown={(e) => {
										e.preventDefault()
										props.set("resizeX", x())
										props.set("resize0", e.x)
										props.set("size0", props.get.widths[i()])
									}}
									style={{
										width: "3px",
										cursor: "col-resize",
										height: resizing() ? "100vh" : "unset",
										background: resizing() ? "dodgerblue" : "transparent",
									}}
								/>
							</div>
						)
					}}
				</For>
			</div>
		</div>
	)
}
