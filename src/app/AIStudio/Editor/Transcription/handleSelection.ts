import { setCustomErrorMessage } from "../ErrorHandler/pipeline"
import { addSegment, setState, state } from "../state"
import { SegmentData } from "../types"

export function getIndex(element: HTMLElement | Node, level = 5): number {
	if (element instanceof HTMLElement && element.dataset.i) {
		return +element.dataset.i
	}
	if (level > 0) {
		return getIndex(element.parentElement, level - 1)
	}
	return -1
}

const maxMargin = 0.5

function nearestPause(t: number, i: 0 | 1, before = true) {
	if (state.pauses.length === 0) return t
	let nearest = 0
	let min = Infinity
	for (const pause of state.pauses) {
		const diff = Math.abs(pause[i] - t)
		if (
			diff < min &&
			(before ? pause[i] < t + maxMargin : pause[i] + maxMargin > t)
		) {
			min = diff
			nearest = pause[i]
		}
	}
	return nearest
}

export function handleSelection() {
	const selection = window.getSelection()

	if (selection.isCollapsed) return

	const [from, to] = [
		getIndex(selection.focusNode),
		getIndex(selection.anchorNode),
	].sort((a, b) => a - b)

	const _from = nearestPause(state.tokens[from].from, 1) - 0.05
	const _to = nearestPause(state.tokens[to].to, 0, false) + 0.05

	if (_from >= _to) {
		setCustomErrorMessage(
			"Please make sure selected variables are within pauses",
			true
		)
		selection.collapse(null)
		return
	}

	const segment: SegmentData = {
		id: "",
		column: -1,
		name: "",
		from: _from, //nearestPause(state.tokens[from].from, 1) - 0.05,
		to: _to, // nearestPause(state.tokens[to].to, 0) + 0.05,
		creating: true,
	}

	console.log("adding segment", {
		segment,
		pauses: state.pauses,
		tokens: state.tokens,
	})

	setState("segments", [...state.segments, segment])

	selection.collapse(null)
}
