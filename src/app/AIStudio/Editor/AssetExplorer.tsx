import { Component, createSignal, Show } from "solid-js"
import { FileManager } from "./FileManagerUI/FileManager"
import { state } from "./state"
import { state as appState } from "../state"
import { FileData } from "./types"

import "./FileManagerUI/style.css"
import { Transcription } from "./Transcription"
import { DropdownIcon } from "@/ui/icons"
import { setOption } from "../ContextMenu"
import { SearchIconButton } from "@/ui/AppMenu"
import { ThreePointIconButton } from "@/ui/icons/ThreePointIconButton"
import { Spreadsheet } from "./Spreadsheet"

export const AssetExplorer: Component = () => {
	const [selected, setSelected] = createSignal("Transcription")
	return (
		<div class="flex-col flex justify-between h-full overflow-auto styled-scrollbar">
			<div class="p-2 flex justify-between">
				<button
					class="flex items-center gap-1 my-1 font-semibold text-sm"
					onClick={(e) => {
						const { x, y, height } = e.currentTarget.getBoundingClientRect()
						setOption({
							position: { x, y: y + height },
							items: [
								{
									name: "Transcription",
									icon: "",
									action: () => setSelected("Transcription"),
								},
								{
									name: "Mappings",
									icon: "",
									action: () => setSelected("Mappings"),
								},
							],
						})
					}}
				>
					{selected}
					<DropdownIcon size={10} />
				</button>
				<div class="flex items-center gap-2">
					<button class="text-[#0095F8] font-semibold text-sm">
						Make Variable
					</button>
					<SearchIconButton
						active={false}
						onClick={() => {}}
					/>
					<ThreePointIconButton />
				</div>
			</div>
			<Show when={selected() === "Mappings"}>
				<Spreadsheet fileId={appState.currentVideo} />
			</Show>

			<Show when={selected() === "Transcription"}>
				<Transcription time={state.currentTime} />
			</Show>

			<div class="min-h-[30vh]">
				<FileManager files={state.files as FileData[]} />
			</div>
		</div>
	)
}
