import { createStore } from "solid-js/store"
import { CellPre } from "./CellPre"
import {
	createDefault,
	getSheetGetSet,
	Mux,
	MuxData,
	MuxGetSet,
	SheetData,
} from "./src"
import { MuxUtils } from "./src/utils/MuxUtils"

import { user } from "@/api2"
import { Component, createEffect, createSignal } from "solid-js"
import { show } from "../../ContextMenu"
import { Client, ClientInfo } from "./src/api"
import { LightningIcon } from "@/ui/icons/LightningIcon"
import { segments } from "@/api2/ai_studio"
import { state } from "../../state"
import { loadSegments, state as editorState } from "../state"
import { formatDuration } from "../utils"

export let sendCreateSheet: (name: string) => SheetData

export let muxGetSet!: MuxGetSet

export const userRepo = new Map<number, ClientInfo & { pfp: string }>()
export const [userRepoUpdate, setUserRepoUpdate] = createSignal(0)

export const Spreadsheet: Component<{ fileId: string }> = (props) => {
	console.log("starting spreadsheet")

	function createSheet(id: number, name: string): SheetData {
		return {
			...createDefault(),
			id,
			name,
			cellPre: CellPre,
			onCellUpdate(x, y, data) {
				console.log("onCellUpdate", get.sheets.indexOf(this), x, y, data)
				if (data.content) {
					client.send("WriteCell", {
						position: [get.sheets.indexOf(this), x, y],
						cell_type: "text",
						content: JSON.stringify(data),
					})
				} else {
					client.send("DeleteCell", {
						cursors: [get.sheets.indexOf(this), x, y],
					})
				}
			},
			onHeadMenu(e, x) {
				show(e, [
					{
						name: "Use as background",
						icon: <LightningIcon />,
						async action() {
							console.log("x is", x)
							const name = getSheetGetSet(muxGetSet).get.rows[0][x].content
							console.log("name is", name)

							const max = editorState.backgroundSegments.reduce(
								(max, { to }) => Math.max(max, to),
								0
							)

							await segments.create({
								audio_variable_column_id: 1, // -1=audio, 1=video background
								audio_variable_name: name,
								prefix_time_marker_end: "",
								prefix_time_marker_start: "",
								suffix_time_marker_end: "",
								suffix_time_marker_start: "",
								variable_time_marker_start: formatDuration(max),
								variable_time_marker_end: formatDuration(max + 1),
								video_instance_id: state.currentVideo,
							})

							loadSegments()
						},
					},
				])
			},
		}
	}

	sendCreateSheet = (name: string) => {
		const number = get.sheets.length
		client.send("CreateSheet", { number, name })
		return createSheet(number, name)
	}

	let client!: Client

	async function connectClient(fileId: string) {
		const {
			result: { first_name, picture },
		} = await user.read()
		console.log("profile", first_name, picture)

		const env =
			import.meta.env.MODE == "stage"
				? ".stage"
				: import.meta.env.MODE == "dev"
				? ".dev"
				: ""

		client = new Client(
			`wss://studio-ws${env}.bhuman.ai/ws/ai_studio/${localStorage.getItem(
				// `wss://test.bhuman.ai/ws/ai_studio/${localStorage.getItem(
				"access_token"
			)}/${fileId}`,
			first_name,
			picture,
			Math.floor(Math.random() * 360),
			{
				Identity(id) {
					console.log("Identity: " + id)
					client.id = id
				},
				UserInfo({ id, info }) {
					if (info) {
						const { name, pfp } = JSON.parse(info.name)
						userRepo.set(id, {
							...info,
							name,
							pfp,
						})
					} else {
						userRepo.delete(id)
						utils.removeCursor(id)
					}
					setUserRepoUpdate((x) => x + 1)
				},
				UserCursor({ id, data }) {
					const user = userRepo.get(id) ?? { name: "Unknown", hue: 0 }
					utils.updateCursor(id, ...data.cursors, user.name, user.hue)
				},
				CreateSheet({ id, sheet }) {
					set("sheets", [...get.sheets, createSheet(id, sheet.name)])
				},
				DeleteSheet({ id, sheet }) {
					utils.removeSheet(sheet.number)
				},
				RenameSheet({ id, sheet }) {
					set("sheets", sheet.number, {
						...get.sheets[sheet.number],
						name: sheet.name,
					})
				},
				GetSheet({ sheet }) {
					this.CreateSheet({ id: sheet.number, sheet })
				},
				WriteCell({ id, cell }) {
					const [i, x, y] = cell.position
					const sheet = get.sheets.find((s) => s.id === i)
					if (!sheet) {
						console.log("Sheet not found", get.sheets, i)
						return
					}
					const cellData = JSON.parse(cell.content)
					if (!sheet.rows[y]) {
						set("sheets", (s) => s.id === i, "rows", y, {
							[x]: cellData,
						})
					} else {
						set("sheets", (s) => s.id === i, "rows", y, x, {
							...(sheet.rows?.[y]?.[x] ?? {}),
							...cellData,
						})
					}
				},
				DeleteCell({ id, cursor }) {
					set(
						"sheets",
						cursor.cursors[0],
						"rows",
						cursor.cursors[2],
						cursor.cursors[1],
						{ content: "" }
					)
				},
				GetCell({ cell }) {
					this.WriteCell({ id: 0, cell })
				},
				BatchCell({ cells }) {
					cells.forEach((cell) => this.WriteCell({ id: 0, cell }))
				},
				BatchSheet({ sheets }) {
					set("sheets", [])

					sheets.forEach((sheet) =>
						this.CreateSheet({ id: sheet.number, sheet })
					)
					if (muxGetSet.get.sheets.length) return
					const name = "Main"
					const id: number = get.sheets.length
					client.send("CreateSheet", { name, number: id })
					set("sheets", (s) => s.concat(createSheet(id, name)))
					set("selected", id)
				},
			}
		)
	}

	createEffect(() => {
		connectClient(props.fileId)
	})

	const [get, set] = createStore<MuxData>({
		selected: 0,
		sheets: [],
		onSheetMenu: (e, i) => {
			show(e, [
				{
					name: "Delete",
					action: () => {
						client.send("DeleteSheet", {
							number: i,
							name: get.sheets.find((s) => s.id === i)!.name,
						})
						utils.removeSheet(i)
					},
					icon: "",
				},
			])
		},
		onSheetAdd: () => {
			const name = prompt("type a name for the sheet") ?? "untitled sheet"
			const id: number = get.sheets.length
			client.send("CreateSheet", { name, number: id })
			return createSheet(id, name)
		},
		onSheetRename: (number, name) => {
			console.log("renaming sheet")
			client.send("RenameSheet", { number, name })
			return name
		},
	})

	muxGetSet = { get, set }

	const utils = new MuxUtils(get, set)

	utils.onSheetSelect = console.log

	utils.onCursorMove = (i, x, y) =>
		client.send("CursorData", { cursors: [i, x, y] })

	return (
		<div style={{ height: "100%", width: "100%" }}>
			<Mux
				get={get}
				set={set}
			/>
		</div>
	)
}
