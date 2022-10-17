import { Component, createSignal, For } from "solid-js";
import { Store } from "solid-js/store";
import { MuxGetSet, SheetData } from "../types";

export const SheetSelect: Component<MuxGetSet> = (props) => {
	return (
		<>
			<For each={props.get.sheets}>
				{(sheet) => {
					const pred = (s: Store<SheetData>) => s.id === sheet.id;
					const [editing, setEditing] = createSignal(false);
					const selected = () => sheet.id === props.get.selected;
					return (
						<div
							style={{
								display: "flex",
								padding: "5px",
								"align-content": "center",
								background: selected() ? "#888" : "#DDD",
								color: selected() ? "white" : "#444",
								gap: "10px",
								border: "1px #888 solid",
								"padding-left": "10px",
								"padding-right": "10px",
								cursor: editing() ? "text" : "pointer",
							}}
							onPointerDown={() => props.set("selected", sheet.id)}
						>
							<div
								contentEditable={editing()}
								style={{
									outline: "none",
								}}
								onDblClick={() => {
									setEditing(true);
								}}
								onBlur={(e) => {
									setEditing(false);
									const name = e.currentTarget.innerText;
									props.set("sheets", pred, "name", name);
									props.get.onSheetRename(sheet.id, name);
									props.set("selected", sheet.id);
								}}
								onKeyDown={(e) => {
									e.cancelBubble = true;
									if (e.key === "Enter") {
										setEditing(false);
									}
								}}
							>
								{sheet.name}
							</div>
							<div onPointerDown={(e) => props.get.onSheetMenu(e, sheet.id)}>
								≡
							</div>
						</div>
					);
				}}
			</For>
            {/* ... 
			<div
				style={{
					display: "flex",
					padding: "5px",
					"align-content": "center",
					background: "#DDD",
					color: "#444",
					gap: "10px",
					border: "1px #888 solid",
					"padding-left": "10px",
					"padding-right": "10px",
					cursor: "pointer",
				}}
				onPointerDown={async (e) => {
					props.set("sheets", [
						...props.get.sheets,
						await props.get.onSheetAdd(e),
					]);
				}}
			>
				+
			</div>
            ... */}
		</>
	);
};
