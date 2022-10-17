import { Component, createEffect, For } from "solid-js"
import { SheetGetSet } from "../types"
import { Cell } from "./Cell"
import { template } from "../utils/layout"
import { handleScroll } from "../utils/scroll"
import "./style.css"

export const Body: Component<SheetGetSet> = (props) => {
	let container!: HTMLDivElement
	let last: unknown

	createEffect(() => {
		if (last !== props.get) {
			container.scrollTop = props.get.realScrollTop
			container.scrollLeft = props.get.realScrollLeft
			last = props.get
		}
	})

	return (
		<div
			ref={container}
			class="sheet-body"
			style={{ overflow: "scroll" }}
			onScroll={(e) => {
				const { scrollLeft, scrollTop } = e.currentTarget
				handleScroll(props, scrollLeft, scrollTop)
			}}
		>
			<div
				style={{
					width: props.get.scrollWidth + "px",
					height: props.get.scrollHeight + "px",
					position: "relative",
				}}
			>
				<div
					style={{
						display: "grid",
						position: "absolute",
						top: props.get.scrollTop + "px",
						left: props.get.scrollLeft + "px",
						"padding-top": "1px",
						"grid-template-rows": template(props.get.heights),
						"grid-template-columns": template(props.get.widths),
					}}
				>
					<For each={props.get.heights}>
						{(_, row) => {
							return (
								<For each={props.get.widths}>
									{(_, column) => {
										return (
											<Cell
												{...props}
												row={row()}
												column={column()}
											/>
										)
									}}
								</For>
							)
						}}
					</For>
				</div>
			</div>
		</div>
	)
}
