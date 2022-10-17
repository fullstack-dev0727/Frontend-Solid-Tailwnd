import { createStore, StoreSetter } from "solid-js/store"
import { EditorState, FileData, SegmentData, TokenData } from "./types"
import { state as appState } from "../state"
import { parseDuration, formatDuration } from "./utils"
import { segments, video_instances } from "@/api2/ai_studio"
import { detectPauses, files, normalizeVideo, transcript } from "@/api2"
import { bucket_key } from "@/api2/utils"
import { createSignal } from "solid-js"

export const [state, setState] = createStore<EditorState>({
	videoUrl: "",
	timelineHeight: 150,
	files: [],
	currentTime: 0,
	segments: [],
	backgroundSegments: [],
	tokens: [],
	pauses: [],
})

console.log(import.meta.env)
export const TMP_BUCKET = import.meta.env.VITE_TMP_BUCKET
export const STATIC_BUCKET = import.meta.env.VITE_STATIC_BUCKET
export const S3_REGION = import.meta.env.VITE_S3_REGION

export const VIDEO_HEADER = "@video"
export const THUMBNAIL_HEADER = "@thumbnail"

export async function loadTranscriptionTokens() {
	setState("tokens", [])
	setState("pauses", [])
	await loadVideoFromInstance()
	await setTranscriptionTokens()
	await refetchPauses()
}

export async function refetchPauses() {
	const data = await detectPauses(state.videoUrl)
	setState(
		"pauses",
		data.map(([start, end]) => [start / 1000, end / 1000] as [number, number])
	)
}

export const [transcriptionProgress, setTranscriptionProgress] = createSignal<{
	stage: string
	step: number
	total: number
}>({ stage: "init", step: 0, total: 5 })

export async function setTranscriptionTokens(overwrite?: string) {
	setTranscriptionProgress({ stage: "init", step: 0, total: 5 })
	let tokens: TokenData[]
	for (let i = 0; i < 2; i++) {
		try {
			tokens = (
				await transcript(
					bucket_key(state.videoUrl)[1],
					overwrite,
					(stage, step, total) => {
						setTranscriptionProgress({ stage, step, total })
					}
				)
			).map((t) => ({
				id: "",
				from: t.begin,
				to: t.end,
				value: t.value,
			}))
			break
		} catch (e) {
			console.log("transcript error", e)
			setTranscriptionProgress({ stage: "converting", step: 0, total: 5 })
			await normalizeVideo(...bucket_key(state.videoUrl))
		}
	}
	setState("tokens", tokens)
}

export async function loadRootFiles() {
	const { result: root } = await files.root()
	const { result: list } = await files.list(root.id)
	setFiles(
		list.map((f) => {
			return {
				name: f.name,
				id: "" + f.id,
				size: f.length,
				dateCreated: new Date(f.created_at),
				extension: "x",
			}
		})
	)
}

loadRootFiles()

export async function loadVideoFromInstance() {
	const {
		result: { video_id },
	} = await video_instances.read({ id: appState.currentVideo })
	if (video_id) {
		const { result: url } = await files.download(video_id)
		setState("videoUrl", TMP_BUCKET + "/" + url)
	} else {
		setState("videoUrl", "")
	}
}

export async function loadSegments() {
	const { result } = await segments.list({
		video_instance_id: appState.currentVideo,
	})

	const stateSegments: SegmentData[] = []
	const backgroundSegments: SegmentData[] = []

	for (const s of result) {
		console.log("segment from backend", s)
		const segment: SegmentData = {
			id: s.id,
			column: s.audio_variable_column_id,
			name: s.audio_variable_name,
			from: parseDuration(s.variable_time_marker_start),
			to: parseDuration(s.variable_time_marker_end),
		}
		if (s.audio_variable_column_id === -1) {
			stateSegments.push(segment)
		} else if (s.audio_variable_column_id === 1) {
			backgroundSegments.push(segment)
		}
	}

	setState("segments", stateSegments)
	setState("backgroundSegments", backgroundSegments)
	return state.segments
}

export async function addSegment(segment: SegmentData) {
	const start = formatDuration(segment.from)
	const end = formatDuration(segment.to)

	await segments.create({
		video_instance_id: appState.currentVideo,
		prefix_time_marker_start: start,
		prefix_time_marker_end: end,
		suffix_time_marker_start: start,
		suffix_time_marker_end: end,
		variable_time_marker_start: start,
		variable_time_marker_end: end,
		audio_variable_column_id: segment.column,
		audio_variable_name: segment.name,
	})

	await loadSegments()
}

export async function removeSegment(id: string) {
	setState(
		"segments",
		state.segments.filter((s) => s.id !== id)
	)

	await segments.delete({ id })

	await loadSegments()
}

export async function renameSegment(id: string, name: string) {
	setState(
		"segments",
		state.segments.findIndex((s) => s.id === id),
		(r) => ({
			...r,
			name,
		})
	)

	await segments.update({
		id,
		audio_variable_name: name,
	})

	await loadSegments()
}

export function setFiles(setter: StoreSetter<FileData[], ["files"]>): void {
	setState("files", setter)
}
