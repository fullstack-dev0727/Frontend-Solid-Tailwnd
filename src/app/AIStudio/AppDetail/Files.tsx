import { For, createSignal, createEffect } from "solid-js"
import { FileIcon } from "@/ui/AppMenu/FileIcon"
import { state } from "../Editor/state"
import { state as appState } from "../state"
import { useNavigate } from "solid-app-router"
import { setTabId } from "../Editor/EditorLeft"
import { updateTabCount } from "../Panel/state"

export const Files = () => {
	const [fileList, setFileList] = createSignal([])
	const navigate = useNavigate()

	createEffect(async () => {
		void appState.currentVideo
		setFileList(state.files)
		updateTabCount({ name: "Files", count: state.files.length })
	})

	return (
		<div class="bg-black/[0.04] rounded-[16px] p-[16px] select-text">
			<div class="text-[17px] leading-[24px] font-[Inter] flex">
				<div class="text-black/[0.9] font-semibold">Files</div>
				<div class="ml-[4px] text-black/[0.6] font-normal ">
					{fileList().length}
				</div>
				<div
					class="cursor-pointer text-[15px] leading-[18px] font-medium text-black/[0.9] mr-0 ml-auto"
					onClick={() => {
						if (appState.currentVideo) {
							navigate((window.location.href.includes("files")?"../editor/": "./editor/") + appState.currentVideo)
							setTabId("assets")
						} else console.log("CURRENT VIDEO ID NOT FOUND")
					}}
				>
					See all
				</div>
			</div>
			<div class="mt-[16px] flex flex-wrap gap-2">
				<For each={fileList()}>
					{(item, i) => (
						<div>
							<FileIcon />
						</div>
					)}
				</For>
			</div>
		</div>
	)
}

export default Files
