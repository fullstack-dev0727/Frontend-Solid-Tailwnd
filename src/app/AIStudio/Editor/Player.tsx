import { Component, createEffect, createSignal, onMount, Show } from "solid-js"
import { PlayerBar } from "./PlayerBar"
import { loadVideoFromInstance, setState, state, S3_REGION } from "./state"
import { instance, Timeline } from "./Timeline"
import { state as ErrorState, ERROR } from "./ErrorHandler/pipeline"
import { Transcription } from "./Transcription"
import { SegmentList } from "./SegmentList"
import { Spinner } from "@/ui/icons/Spinner"

export const Player: Component<{
	width: number
	height: number
	onRecord: () => void
}> = (props) => {
	let canvas!: HTMLCanvasElement
	let ctx!: CanvasRenderingContext2D
	let needsRedraw = false

	const video = document.createElement("video")
	const [videoLoading, setVideoLoading] = createSignal(false)
	const [playing, setPlaying] = createSignal(false)
	const [barCurrentTime, setBarCurrentTime] = createSignal("00:00")

	function play() {
		setPlaying(true)
		video.play()
	}

	function stop() {
		setPlaying(false)
		video.pause()
	}

	function onBarPlay() {
		console.log("playing")
		if (playing()) {
			stop()
		} else {
			play()
		}
	}

	function drawVideo() {
		// video may not be ready when scrolling timeline, so update when ready
		let hasBackground = false
		for (const seg of state.backgroundSegments) {
			if (seg.from <= state.currentTime && seg.to >= state.currentTime) {
				hasBackground = true
				break
			}
		}
		if (hasBackground) {
			const w_2 = canvas.width / 2
			const h_2 = canvas.height / 2
			ctx.fillStyle = "gray"
			ctx.fillRect(0, 0, canvas.width, canvas.height)
			ctx.drawImage(video, w_2, h_2, w_2, h_2)
		} else {
			ctx.drawImage(video, 0, 0)
		}
	}

	function updateCurrentTime() {
		const timelineTime = instance.current_frame / instance.frame_rate
		if (Math.abs(video.currentTime - timelineTime) > 0.1) {
			video.currentTime = timelineTime // chromium doesn't like reassigning this value
			setState("currentTime", timelineTime)
			needsRedraw = true
		}
		if (needsRedraw && video.readyState > 2) {
			drawVideo()
			needsRedraw = false
		}
	}

	function render() {
		if (playing()) {
			instance.current_frame = video.currentTime * instance.frame_rate
			setState("currentTime", video.currentTime)
			drawVideo()
		} else {
			updateCurrentTime()
		}

		requestAnimationFrame(render)
	}

	createEffect(() => {
		const { videoUrl } = state
		console.log("video is now", video, videoUrl)
		if (video && videoUrl) {
			video.src = `https://s3.${S3_REGION}.amazonaws.com/${videoUrl}#t=1`
			video.load()
			setVideoLoading(true)
		}

		else if (video) {
			video.src = ''
			setVideoLoading(false)
		}
	})

	onMount(async () => {
		await loadVideoFromInstance()
		ctx = canvas.getContext("2d")

		video.oncanplay = () => {
			canvas.height = video.videoHeight
			canvas.width = video.videoWidth
			setVideoLoading(false)
		}

		video.onended = () => setPlaying(false)

		render()

		setInterval(() => {
			setBarCurrentTime(
				Math.floor(video.currentTime / 60)
					.toString()
					.padStart(2, "0") +
					":" +
					Math.floor(video.currentTime % 60)
						.toString()
						.padStart(2, "0")
			)
		}, 100)
	})

	return (
		<>
			<div class="flex items-center justify-center relative">
				<canvas
					class="w-full block"
					ref={canvas}
				/>
				<Show when={videoLoading()}>
					<div class="absolute">
						<Spinner
							height="h-16"
							width="w-16"
						/>
					</div>
				</Show>
			</div>
			<PlayerBar
				onRecord={props.onRecord}
				currentTime={barCurrentTime()}
				onPlay={onBarPlay}
				playActive={playing()}
			/>
			<Show when={ErrorState.error !== ERROR.OK}>
				<div class="px-5 pt-2 text-sm text-red-500">{ErrorState.message}</div>
			</Show>
			<div class="p-5">
				<Transcription time={state.currentTime} />
				<SegmentList />
			</div>
			<Timeline />
		</>
	)
}
