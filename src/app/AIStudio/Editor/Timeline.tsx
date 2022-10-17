import { Component, createEffect, onCleanup, onMount } from "solid-js"

import axiosApi from "@/api"
import Clip from "canvas_timeline/src/data/clip"
import { registerRequestRedraw } from "canvas_timeline/src/data/clip_cache"
import { registerVideoGetter } from "canvas_timeline/src/data/clip_video_draw"
import { MediaType } from "canvas_timeline/src/data/media"
import TimelineGUI from "canvas_timeline/src/gui/timeline"
import { configureTimeline } from "./configureTimeline"
import { addSegment, loadSegments, state } from "./state"
import { segments } from "@/api2/ai_studio"
import { detectPauses } from "@/api2"

async function fetchAssociate(video: HTMLVideoElement, id: string) {
	const { data } = await axiosApi.get(`fetch_video?id=${id}`, {
		responseType: "blob",
	})
	video.src = URL.createObjectURL(data)
}

registerVideoGetter((id) => {
	console.log("trying to get video", id)
	const video = document.createElement("video")
	fetchAssociate(video, id)
	return video
})

export let instance: TimelineGUI
const unbound: HTMLElement[] = []

function _bindElement(element: HTMLElement) {
	element.ondragstart = instance.OnMediaDragStarted.bind(instance)
	element.ondragend = instance.OnMediaDragCanceled.bind(instance)
}

export function bindElement(element: HTMLElement) {
	if (instance) {
		_bindElement(element)
	} else {
		unbound.push(element)
	}
}

async function updateSegment(
	id: string,
	name: string,
	from: number,
	to: number,
	column: -1 | 1
) {
	await segments.delete({ id })

	await loadSegments()

	await addSegment({
		id,
		name,
		from,
		to,
		column,
	})
}

const canvas: HTMLCanvasElement = document.createElement("canvas")
canvas.style.zIndex = 10000 + ""
canvas.height = state.timelineHeight

function commitSegments() {
	for (const clip of variables.clips.concat(backgrounds.clips)) {
		const [column, start, end] = logs[clip.id]
		if (clip.start !== start || clip.end !== end) {
			updateSegment(clip.id, clip.name, clip.start / 30, clip.end / 30, column)
		}
	}
}

canvas.addEventListener("pointerup", commitSegments)

setInterval(() => {
	for (const id of Object.keys(logs)) {
		if (!variables.clips.concat(backgrounds.clips).find((c) => c.id === id)) {
			segments.delete({ id })
			delete logs[id]
		}
	}
}, 1000)

configureTimeline()
instance = new TimelineGUI(canvas)
const backgrounds = instance.content.addTextTrack("Backgrounds")
const variables = instance.content.addTextTrack("Variables")
const pauses = instance.content.addTextTrack("Pauses")
// const words = instance.content.addTextTrack("Words")

const logs: Record<string, [-1 | 1, number, number]> = {}
for (const el of unbound) _bindElement(el)

export const Timeline: Component = () => {
	let container!: HTMLDivElement

	console.log("rerendering timeline")

	registerRequestRedraw(() => instance.render())

	onCleanup(() => {
		canvas.remove()
	})

	onMount(() => {
		container.appendChild(canvas)
	})

	createEffect(() => {
		if (canvas) {
			canvas.height = state.timelineHeight
		}

		// words.clips = state.tokens.map((token) => {
		// 	const clip = new Clip(
		// 		token.from + "/" + token.to,
		// 		token.value,
		// 		MediaType.Text,
		// 		token.from * 30,
		// 		token.to * 30,
		// 		10000
		// 	)

		// 	return clip
		// })

		console.log({ pauses: state.pauses })

		pauses.clips = state.pauses.map(
			([start, end]) =>
				new Clip(
					start + "/" + end,
					"silence",
					MediaType.Text,
					start * 30,
					end * 30,
					10000
				)
		)

		variables.clips = state.segments.map((seg) => {
			const clip = new Clip(
				seg.id,
				seg.name,
				MediaType.Text,
				seg.from * 30,
				seg.to * 30,
				10000
			)

			clip.head = 300
			clip.tail = 300

			logs[clip.id] = [-1, clip.start, clip.end]

			return clip
		})

		backgrounds.clips = state.backgroundSegments.map((seg) => {
			console.log("background", seg)

			const clip = new Clip(
				seg.id,
				seg.name,
				MediaType.Text,
				seg.from * 30,
				seg.to * 30,
				10000
			)

			clip.head = 300
			clip.tail = 300

			logs[clip.id] = [1, clip.start, clip.end]

			return clip
		})

		instance.OnResize()
	})

	return <div ref={container} />
}
