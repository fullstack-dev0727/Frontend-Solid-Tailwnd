import {
	Component,
	createEffect,
	createMemo,
	createSignal,
	Match,
	onCleanup,
	onMount,
	Show,
	Switch,
} from "solid-js"
import {
	collapseSelection,
	isInRange,
	isInSelection,
	isSelected,
	setSelected,
	setSelection,
	startSelecting,
} from "../utils/selection"
import { CellData, CursorData, SheetGetSet } from "../types"
import { setCell, setText } from "../utils/data"
import { Dynamic } from "solid-js/web"
import { TAB } from "../utils"
import { styles } from "../styles"

export interface CellProps extends SheetGetSet {
	row: number
	column: number
}

export const Cell: Component<CellProps> = (props) => {
	let inner!: HTMLDivElement
	let pre!: HTMLDivElement

	const observer = new ResizeObserver(() => setPreWidth(pre.clientWidth))

	const [innerWidth, setInnerWidth] = createSignal(0)
	const [preWidth, setPreWidth] = createSignal(0)

	const x = () => props.column + props.get.scrollX
	const y = () => props.row + props.get.scrollY
	const rowCells = () => props.get.rows[y()]
	const cellData = () => rowCells()?.[x()] ?? props.get.defaultCell

	function cursor(): CursorData | undefined {
		for (const c of props.get.cursors) {
			if (c.x === x() && c.y === y()) return c
		}
		return undefined
	}

	const selected = () => isSelected(props, x(), y())
	const selection = () => isInSelection(props, x(), y())
	const ySelection = () =>
		isInRange(y(), props.get.selectedY, props.get.selectionY)
	const xSelection = () =>
		isInRange(x(), props.get.selectedX, props.get.selectionX)
	const single = () =>
		selected() && props.get.selectionX === x() && props.get.selectionY === y()

	onMount(() => {
		setInnerWidth(inner.clientWidth)
		observer.observe(pre)
	})

	onCleanup(() => observer.unobserve(pre))

	createEffect(() => {
		void cellData().content
		setInnerWidth(inner.clientWidth)
		setPreWidth(pre.clientWidth)

		if (selected() && props.get.focusing) {
			inner.focus()
		}
	})

	const outerWidth = createMemo(() => {
		let w = props.get.widths[props.column]
		let i = props.column + 1
		let x1 = x() + 1
		while (i < props.get.widths.length && w < innerWidth() + preWidth()) {
			if (!selected() && rowCells()?.[x1]?.content) break
			w += props.get.widths[i]
			i++
			x1++
		}
		return w
	})

	return (
		<div
			onPointerDown={(e) => {
				props.set("focusing", selected())
				if (!cellData()?.content) e.preventDefault()
				startSelecting(props)
				setSelected(props, x(), y())
				collapseSelection(props)
			}}
			onPointerMove={(e) => {
				e.preventDefault()
				if (props.get.selecting) setSelection(props, x(), y())
			}}
			style={{
				position: "relative",
			}}
		>
			<div
				title={cursor()?.name ?? ""}
				style={{
					display: "flex",
					"align-items": "center",
					"border-width": selected()
						? styles.active.borderWidth
						: styles.normal.borderWidth,
					"border-style": "solid",
					"border-color": selected()
						? styles.active.border
						: cursor()
						? `hsl(${cursor()?.hue}, 100%, 30%)`
						: "#D2D2D7",
					"border-top-color":
						selected() ||
						(xSelection() &&
							y() === Math.min(props.get.selectionY, props.get.selectedY))
							? styles.highlight.border
							: styles.normal.border,
					"border-bottom-color":
						selected() ||
						(xSelection() &&
							y() === Math.max(props.get.selectionY, props.get.selectedY))
							? styles.highlight.border
							: styles.normal.border,
					"border-left-color":
						selected() ||
						(ySelection() &&
							x() === Math.min(props.get.selectionX, props.get.selectedX))
							? styles.highlight.border
							: styles.normal.border,
					"border-right-color":
						selected() ||
						(ySelection() &&
							x() === Math.max(props.get.selectionX, props.get.selectedX))
							? styles.highlight.border
							: styles.normal.border,

					position: "absolute",
					top: "-1px",
					left: "-1px",
					bottom: "0px",
					width: outerWidth() + 1 + "px",
					"z-index":
						selected() || cursor()
							? Number.MAX_SAFE_INTEGER
							: cellData().content !== "" || selection()
							? x() + 1
							: 0,
					background: selection() && !single() ? "#E8F3FD" : "white",
					"box-shadow": selected() ? "0px 0px 1px black" : "",
					overflow: "hidden",
				}}
			>
				<div
					spellcheck={false}
					ref={inner}
					contentEditable={selected() && props.get.focusing}
					onPaste={(e) => {
						e.preventDefault()
						const csv = e.clipboardData?.getData("text") ?? ""
						setText(props, x(), y(), csv, TAB)
					}}
					onInput={() => {
						if (inner.innerText === "") inner.append(new Text())
						const selection = window.getSelection()!
						const offset = selection.focusOffset
						setCell(props, x(), y(), { content: inner.innerText })
						setInnerWidth(inner.clientWidth)
						selection.removeAllRanges()
						const range = document.createRange()
						range.setStart(inner.firstChild!, offset)
						range.collapse()
						selection.addRange(range)
					}}
					style={{
						display: "inline",
						outline: "none",
						width: "max-content",
						position: "absolute",
						left: preWidth() + "px",
						"font-size": "13px",
					}}
				>
					<Switch>
						<Match when={cellData().url}>
							<a
								class="text-sky-300 underline"
								target={"_blank"}
								href={cellData().url}
							>
								Link
							</a>
						</Match>
						<Match when={cellData().input}>{cellData().input}</Match>
						<Match when={!cellData().url || !cellData().input}>
							{cellData().content}
						</Match>
					</Switch>
					{/*{cellData().content}*/}
				</div>
				<div ref={pre}>
					<Dynamic
						component={props.get.cellPre}
						x={x()}
						y={y()}
						cellData={cellData() as CellData}
						selected={selected()}
						selection={selection()}
						{...props}
					/>
				</div>
			</div>
		</div>
	)
}
