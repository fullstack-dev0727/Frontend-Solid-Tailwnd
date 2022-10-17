import { JSXElement, onMount, ParentProps } from "solid-js"
import { FileData } from "../FileManager"
import { bindElement } from "../../Timeline"
import { ContextMenuItem, show } from "@/app/AIStudio/ContextMenu"
import { files } from "@/api2"
import { video_instances } from "@/api2/ai_studio"
import { state } from "../../../state"
import {
	loadTranscriptionTokens,
	loadVideoFromInstance,
	TMP_BUCKET,
	S3_REGION,
} from "../../state"
import { COMMA, getSheetGetSet, setText } from "../../Spreadsheet/src"
import { sendCreateSheet, muxGetSet } from "../../Spreadsheet"
import { setTabId } from "../../EditorLeft"

function ext2type(ext: string): string {
	return (
		{
			mp4: "video",
			wav: "audio",
			csv: "text",
		}[ext] ?? "unknown"
	)
}

export const DataRow = (props: {
	field: JSXElement
	selected?: boolean
	onClick: () => void
	onShiftClick: () => void
	onMouseEnter: () => void
	file: FileData
}) => {
	let el!: HTMLDivElement
	onMount(() => {
		bindElement(el)
	})
	return (
		<div
			ref={el}
			class={`flex gap-3 p-1 rounded cursor-pointer select-none transition-all duration-[100ms] ${
				props.selected ? "bg-gray-300" : "hover:bg-gray-200"
			}`}
			data-id={props.file.id}
			data-duration={props.file.duration}
			data-type={ext2type(props.file.extension + "")}
			data-name={props.file.name}
			draggable={true}
			// onMouseEnter={() => {
			// 	props.onMouseEnter()
			// }}
			// onMouseDown={(e) => {
			// 	e.preventDefault()
			// 	if (e.shiftKey) props.onShiftClick()
			// 	else props.onClick()
			// }}
			onContextMenu={(e) => {
				const items: ContextMenuItem[] = []
				if (
					["mp4", "webm", "png", "jpg", "jpeg"].find((x) =>
						props.file.name.endsWith("." + x)
					) &&
					!props.file.name.endsWith(".audio.webm")
				) {
					items.push({
						name: "Copy file ID",
						icon: "",
						action() {
							navigator.clipboard.writeText("file:" + props.file.id)
						},
					})
				}

				if (props.file.name.endsWith(".csv")) {
					items.push({
						name: "Import CSV",
						icon: "",
						async action() {
							const { result: url } = await files.download(props.file.id)
							const res = await fetch(
								"https://s3." +
									S3_REGION +
									".amazonaws.com/" +
									TMP_BUCKET +
									"/" +
									url
							)
							const text = await res.text()
							const sheet = sendCreateSheet(props.file.name)
							muxGetSet.set("sheets", (sheets) => sheets.concat(sheet))
							muxGetSet.set("selected", sheet.id)
							const sheetProps = getSheetGetSet(muxGetSet)
							setText(sheetProps, 0, 0, text, COMMA)
							setTabId("database")
						},
					})
				}
				if (props.file.name.startsWith("recording-")) {
					items.push({
						name: "Use as template video",
						icon: "",
						async action() {
							await video_instances.update({
								id: state.currentVideo,
								video_id: props.file.id,
							})
							await loadVideoFromInstance()
							await loadTranscriptionTokens()
						},
					})
				}
				if (items.length > 0) {
					show(e, items)
				} else {
					show(e, [
						{
							name: "No actions can be done",
							icon: "",
							action() {},
						},
					])
				}
			}}
		>
			{props.field}
		</div>
	)
}

/**
 * Automatically handles resizing of the row - it's not necessary to use it.
 */
export const DataRowField = (
	props: ParentProps<{
		resize?: number
		class?: string
	}>
) => {
	return (
		<div
			class={props.class}
			style={{
				flex: props.resize ? `0 0 ${props.resize - 4}px` : "1 1 0",
			}}
		>
			{props.children}
		</div>
	)
}
