import { Component, Show } from "solid-js"
import { Renamable } from "@/ui/Form/Renamable"
import { show } from "../../ContextMenu"
import { renameSegment, setState, state } from "../state"
import { DropdownIcon } from "@/ui/icons"

export const TableHead: Component<{ name: string; column: number }> = (
	props
) => {
	let el!: HTMLTableCellElement

	const segment = () => state.segments.find((s) => s.column === props.column)

	function onCtxMenu(e: MouseEvent) {
		show(e, [
			{
				name: "Delete",
				action: () => console.log("delete " + props.name),
				icon: "",
			},
			...state.segments.map((s) => {
				const mapped = s.name === segment()?.name
				return {
					name: (mapped ? "Unmap from " : "Map to ") + s.name,
					icon: "",
					action: () => {
						setState(
							"segments",
							state.segments.findIndex((t) => t.id === s.id),
							"column",
							mapped ? -1 : props.column
						)
					},
				}
			}),
		])
	}

	return (
		<td
			ref={el}
			class={`border p-2 resize-x overflow-x-auto`}
			onContextMenu={onCtxMenu}
		>
			<div class="flex justify-between items-center gap-2">
				<div class="flex gap-1 items-center">
					<Renamable
						onRename={console.log}
						name={props.name}
					/>

					<Show when={segment()}>
						<div class="rounded bg-[#DA5597] text-white px-1 text-sm">
							<Renamable
								name={segment().name}
								onRename={(name) => {
									renameSegment(segment().id, name.trim() || "untitled")
								}}
							/>
						</div>
					</Show>
				</div>

				<button
					onClick={onCtxMenu}
					class="p-1 rounded hover:bg-[#000000]/[0.08]"
				>
					<DropdownIcon size={10} />
				</button>
			</div>
		</td>
	)
}
