import { Component, Show } from "solid-js"
import { Store } from "solid-js/store"
import { getSheetGetSet, MuxGetSet, Sheet, SheetData } from ".."
import { SheetSelect } from "./SheetSelect"

export const Mux: Component<MuxGetSet> = (props) => {
	const pred = (s: Store<SheetData>) => s.id === props.get.selected
	const get = () => props.get.sheets.find(pred)
	return (
		<div
			style={{
				width: "100%",
				height: "100%",
			}}
		>
			<div
				style={{
					width: "100%",
					height: "calc(100% - 30px)",
				}}
			>
				<Show
					when={get()}
					fallback="Nothing selected"
				>
					<Sheet {...getSheetGetSet(props)} />
				</Show>
			</div>
			<div
				style={{
					display: "flex",
					height: "30px",
					background: "#EEE",
				}}
			>
				<SheetSelect {...props} />
			</div>
		</div>
	)
}
