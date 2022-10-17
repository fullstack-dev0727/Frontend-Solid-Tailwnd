import { createStore } from "solid-js/store"
import { CellData } from "../Spreadsheet/src"
import { Column } from "../api/generatePipeline"
import { SegmentData } from "../types"
import { Audio } from "../../../../../src/api2/ai_studio/audios"
import {
	isArrayIncludesItemWithKey,
	hasArrayDifferentValueWithKey,
} from "../utils"
import { createSignal } from "solid-js"

export enum ERROR {
	OK = 200,
	ACTOR_NOT_FOUND = "ACTOR_NOT_FOUND",
	SEGMENT_NOT_FOUND = "SEGMENT_NOT_FOUND",
	ROWS_NOT_MATCH = "ROWS_NOT_MATCH",
	MARKER_HEADER_NAME_NOT_MATCH = "MARKER_HEADER_NAME_NOT_MATCH",
	AUDIO_NOT_FOUND = "AUDIO_NOT_FOUND",
	FAILED = "FAILED",
}

export enum ERROR_MESSAGE {
	OK = "VALID",
	ACTOR_NOT_FOUND = "Please select an actor to continue",
	SEGMENT_NOT_FOUND = "Please select variables from transcription before generating videos",
	ROWS_NOT_MATCH = "Row numbers for selected variables must match!",
	MARKER_HEADER_NAME_NOT_MATCH = "Marker names and selected column headers must exactly match!",
	AUDIO_NOT_FOUND = "Please generate or record audio before generating videos",
}

type PipelineErrorState = {
	error: ERROR
	message: ERROR_MESSAGE | string
}

export const [state, setState] = createStore<PipelineErrorState>({
	error: ERROR.OK,
	message: ERROR_MESSAGE.OK,
})

const controller = new AbortController()
globalThis.addEventListener("click", clickHandler, {
	signal: controller.signal,
})
const [flag, setFlag] = createSignal(false)

function clickHandler() {
	return
	if (!flag()) {
		setState("error", ERROR.OK)
		setState("message", ERROR_MESSAGE.OK)
	} else setFlag(false)
}

export function validateActor(actor_id: string) {
	setState("error", ERROR.OK)
	setState("message", ERROR_MESSAGE.OK)
	if (!actor_id) {
		// ERROR -- ACTOR NOT FOUND
		setState("error", ERROR.ACTOR_NOT_FOUND)
		setState("message", ERROR_MESSAGE.ACTOR_NOT_FOUND)
		console.log("ERROR STATUS: ", state.error)
	}
	return state.error === ERROR.OK
}

export async function validatePipelineRequest(
	cells: CellData[],
	columns: Column[],
	segments: SegmentData[],
	audioList: Audio[]
) {
	setState("error", ERROR.OK)
	setState("message", ERROR_MESSAGE.OK)
	if (segments.length < 1) {
		// ERROR -- SEGMENT NOT FOUND
		setState("error", ERROR.SEGMENT_NOT_FOUND)
		setState("message", ERROR_MESSAGE.SEGMENT_NOT_FOUND)
	} else if (!(await checkMarkerNamesMatch(columns, segments))) {
		// ERROR -- VARIABLE MAKER NAME AND COLUMN HEADER NOT MATCH
		setState("error", ERROR.MARKER_HEADER_NAME_NOT_MATCH)
		setState("message", ERROR_MESSAGE.MARKER_HEADER_NAME_NOT_MATCH)
	} else if (hasArrayDifferentValueWithKey(columns, "count")) {
		// ERROR -- SELECTED COLUMNS AS VARIABLES HAS DIFFERENT AMOUNT OF ROWS
		setState("error", ERROR.ROWS_NOT_MATCH)
		setState("message", ERROR_MESSAGE.ROWS_NOT_MATCH)
	} else if (
		!audioList ||
		audioList.length < 1 ||
		cells.length !== audioList.length ||
		isArrayIncludesItemWithKey(audioList, "error")
	) {
		// ERROR -- AUDIO NOT FOUND
		setState("error", ERROR.AUDIO_NOT_FOUND)
		setState("message", ERROR_MESSAGE.AUDIO_NOT_FOUND)
	}
	console.log("ERROR STATUS: ", state.error)
	return state.error === ERROR.OK
}

function checkMarkerNamesMatch(columns: Column[], segments: SegmentData[]) {
	if (!columns || !segments || columns?.length === 0 || segments?.length === 0)
		return false
	const headers = columns.map((column) => column.header)
	const markers = segments.map((segment) => segment.name)
	for (const marker of markers) if (!headers?.includes(marker)) return false
	return true
}

export function setCustomErrorMessage(message: string, flag?: boolean) {
	if (flag) setFlag(true)
	setState("error", ERROR.FAILED)
	setState("message", message)
}
