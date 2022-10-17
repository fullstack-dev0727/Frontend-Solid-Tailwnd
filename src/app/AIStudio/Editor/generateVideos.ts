// import { generateAudio } from "./api/generatePipeline"
// import { muxGeSet } from "./Spreadsheet"
import { files } from "@/api2"
import { audios, video_instances } from "@/api2/ai_studio"
import { Pipeline2Request, postPipeline2 } from "@/api2/ai_studio/postPipeline2"
import { processAudio } from "@/api2/ai_studio/processAudio"
import { createSignal } from "solid-js"
import { state as appState } from "../state"
import { getSegmentedCells } from "./api/generatePipeline"
import {
	setCustomErrorMessage,
	validateActor,
	validatePipelineRequest,
} from "./ErrorHandler/pipeline"
import { muxGetSet } from "./Spreadsheet"
import { CellData, getSheetGetSet, setCell } from "./Spreadsheet/src"
import { state, THUMBNAIL_HEADER, TMP_BUCKET, VIDEO_HEADER } from "./state"
import { SegmentData } from "./types"
import { getArrayItemWithKeyAndValue, responseFromMilliSeconds } from "./utils"

function ensureColumn(name: string) {
	const props = getSheetGetSet(muxGetSet)
	for (let x = 0; x < 100; x++) {
		const content = props.get.rows?.[0]?.[x]?.content
		if (content === name) break
		if (content) continue
		setCell(props, x, 0, { content: name })
		break
	}
}

export async function computeIndex(
	videoUrl: string,
	row: string[],
	ranges: [string, string][]
) {
	const data = `${videoUrl}
${row.join(" ")}
${ranges.flat().join(" ")}`
	const bytes = new TextEncoder().encode(data)
	const hash = await crypto.subtle.digest("SHA-256", bytes)
	const index = new Int32Array(hash)[0]
	return index
}

export const [cacheIndices, setCacheIndices] = createSignal<
	Record<number, number>
>({})

export async function preparePipelineRequest(): Promise<Pipeline2Request | void> {
	if (muxGetSet.get.sheets.length === 0) return

	// Trigger pipeline
	console.log("state", state)
	const {
		result: { actor_id, video_id },
	} = await video_instances.read({
		id: appState.currentVideo,
	})

	//////////////// Check for actor_id to not make duplicate requests
	if (!validateActor(actor_id)) return // ERROR
	////////////////

	// GET AUDIO URLS
	const [cells, , columns] = getSegmentedCells(
		muxGetSet,
		state.segments.map((s) => s.name)
	)
	const audioList = (
		await Promise.all(cells.map((c) => audios.find(c.content, actor_id)))
	).map((c) => c.result)

	async function finalAudioUrl(cell: CellData) {
		const url = getArrayItemWithKeyAndValue(
			audioList,
			"name",
			cell.content
		)?.url
		return "s3://" + (await processAudio(state.videoUrl, url))
	}

	if (
		!(await validatePipelineRequest(cells, columns, state?.segments, audioList))
	)
		return

	const ranges: [string, string][] = []
	let rows: string[][] = []
	const yy: number[] = []
	let background_rows: string[][] = []
	const background_ranges: [string, string][] = []

	const sortedSegments = JSON.parse(
		JSON.stringify(state.segments)
	) as SegmentData[] // deep copy
	sortedSegments.sort((a: SegmentData, b: SegmentData) => a.from - b.from)

	for (const segment of sortedSegments) {
		////////RANGES//////
		const start = responseFromMilliSeconds(segment.from * 1000)
		const end = responseFromMilliSeconds(segment.to * 1000)
		ranges.push([start, end])

		////////ROWS////////
		const [cells, locations] = getSegmentedCells(muxGetSet, [segment.name])

		if (rows.length > 0) {
			for (const [i, c] of cells.entries()) {
				rows[i].push(await finalAudioUrl(c))
			}
		} else {
			rows = await Promise.all(
				cells.map(async (c, i) => {
					yy.push(locations[i].y)
					return [await finalAudioUrl(c)]
				})
			)
		}
	}

	for (const segment of state.backgroundSegments
		.slice()
		.sort((a, b) => a.from - b.from)) {
		const from = responseFromMilliSeconds(segment.from * 1000)
		const to = responseFromMilliSeconds(segment.to * 1000)
		background_ranges.push([from, to])

		const [cells] = getSegmentedCells(muxGetSet, [segment.name])
		const urls = await Promise.all(
			cells.map(async (c) => {
				const [_, id] = c.content.match("file:(.+)") ?? []
				if (!id) return ""
				const { result } = await files.download(id)
				return `s3://${TMP_BUCKET}/${result}`
			})
		)
		background_rows = urls.map((u, y) => (background_rows[y] ?? []).concat(u))
		console.log("background_rows", background_rows, background_ranges)
	}

	const indices = await Promise.all(
		rows.map((row) => computeIndex(state.videoUrl, row, ranges))
	)

	setCacheIndices(Object.fromEntries(yy.map((y, i) => [y, indices[i]])))

	return {
		rows,
		ranges,
		indices,
		actor_id,
		video_id,
		background_rows: background_rows.length ? background_rows : undefined,
		background_ranges: background_ranges.length ? background_ranges : undefined,
	}
}

export async function generateVideos(): Promise<boolean> {
	const request = await preparePipelineRequest()
	if (!request) return false
	const pipelineResp = await postPipeline2(request)

	console.log("pipelineResp", pipelineResp)
	if (pipelineResp?.result?.error) {
		// ERROR
		setCustomErrorMessage(pipelineResp.result.error)
		return false
	}

	ensureColumn(VIDEO_HEADER)
	ensureColumn(THUMBNAIL_HEADER)
	return true
}

// let page = currentPage()

// if (page && !page.settings.vimeo_enabled) {
// 	let interval: NodeJS.Timer

// 	interval = setInterval(async () => {
// 		const { result } = await json(
// 			get(
// 				query("api/ai_studio/generated_video", {
// 					actor_id,
// 					video_id,
// 				})
// 			)
// 		)
// 		const { url, status } = result[result.length - 1]

// 		if (status == "succeeded") {
// 			let video_url = url
// 				.replace("s3", "https")
// 				.replace(
// 					`bhuman-platform-static`,
// 					`bhuman-platform-static.s3.us-east-2.amazonaws.com`
// 				)

// 			let widgets = page.widgets.map((w) => {
// 				if (w.name == "video") {
// 					return { data: video_url, name: w.name, id: w.id }
// 				} else {
// 					return { data: w.data, name: w.name, id: w.id }
// 				}
// 			})

// 			await generated_page.create({
// 				page: {
// 					name: name,
// 					video: page.id,
// 					video_instance: video_id,
// 					vimeo_enabled: page.settings.vimeo_enabled,
// 					comments_enabled: page.settings.comments_enabled,
// 					emoji_enabled: page.settings.emoji_enabled,
// 					default_template: page.settings.default_template,
// 				},
// 				widgets: widgets,
// 			})

// 			alert("Page has been generated")

// 			clearInterval(interval)
// 		}
// 	}, 5000)
// }
