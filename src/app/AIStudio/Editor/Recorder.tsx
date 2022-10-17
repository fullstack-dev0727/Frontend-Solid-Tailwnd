import { files } from "@/api2"
import { video_instances } from "@/api2/ai_studio"
import {
	Component,
	createEffect,
	createSignal,
	onCleanup,
	onMount,
} from "solid-js"
import { state as appState } from "../state"
import { formatDuration } from "./FileManagerUI/FileManager/content/file"
import { RecorderBar } from "./RecorderBar"
import {
	loadRootFiles,
	loadTranscriptionTokens,
	loadVideoFromInstance,
} from "./state"
import { Timeline } from "./Timeline"

export type RecorderState = "idle" | "recording" | "paused" | "playing"

export const Recorder: Component<{
	width: number
	height: number
	onCancel: () => void
}> = (props) => {
	let preview: HTMLVideoElement
	let recorder: MediaRecorder
	const [recorderState, setRecorderState] = createSignal<RecorderState>("idle")
	const [saveLoading, setSaveLoading] = createSignal(false)
	const [previewUrl, setPreviewUrl] = createSignal("")
	const [currentTime, setCurrentTime] = createSignal("00:00:00")
	const [saveText, setSaveText] = createSignal("Save")

	let startTime = 0

	let blob!: Blob
	const parts: Blob[] = []

	async function setupPreview() {
		const stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true,
		})

		if (preview) preview.srcObject = stream
	}

	createEffect(() => {
		preview.currentTime = 0
		preview.play()
		if (previewUrl()) {
			preview.srcObject = null
			preview.src = previewUrl()
		} else {
			setupPreview()
		}
	})

	onMount(() => {
		if (recorder) preview.srcObject = recorder.stream
	})

	onCleanup(() => {
		preview.srcObject = null
		console.log("stopping recorder")
		if (recorder) recorder.stream.getTracks().forEach((t) => t.stop())
	})

	setInterval(() => {
		if (recorderState() === "idle") return
		const begin = recorderState() === "recording" ? startTime : 0
		setCurrentTime(formatDuration(preview.currentTime - begin))
	}, 100)

	return (
		<div class="flex flex-col overflow-y-hidden justify-end">
			<div class="flex items-center justify-center">
				<video
					class="w-full block"
					width={props.width}
					height={props.height}
					ref={preview}
					autoplay
					muted={recorderState() !== "playing"}
				/>
			</div>
			<RecorderBar
				disabled={recorderState() !== "playing"}
				saveText={saveText()}
				saveLoading={saveLoading()}
				recorderState={recorderState()}
				onCancel={props.onCancel}
				currentTime={currentTime()}
				onPlay={() => {
					setRecorderState("playing")
				}}
				onRecord={() => {
					parts.length = 0
					// @ts-ignore - preview has captureStream
					const stream = preview.captureStream()

					recorder = new MediaRecorder(stream, {
						mimeType: "video/webm;codecs=pcm",
					})

					setRecorderState("recording")
					recorder.start()
					startTime = preview.currentTime

					recorder.ondataavailable = (e) => {
						console.log("ondataavailable", e.data.size)
						parts.push(e.data)
						setTimeout(() => {
							if (recorder.state === "recording") {
								recorder.requestData()
							}
						}, 1000)
					}

					recorder.requestData()
				}}
				onPause={() => {
					recorder.stop()
					blob = new Blob(parts)
					const url = URL.createObjectURL(blob)

					setRecorderState("playing")

					setPreviewUrl(url)
				}}
				onSave={async () => {
					setSaveLoading(true)
					blob = new Blob(parts)
					setSaveText("Uploading")
					const { result: root } = await files.root()
					const prepushRes = await files.pre_push(
						root.id,
						"recording-" + new Date().toJSON() + ".webm"
					)
					await files.push(prepushRes.result.file_id, blob)

					await video_instances.update({
						id: appState.currentVideo,
						video_id: prepushRes.result.file_id,
					})
					setSaveText("Transcribing")
					await loadTranscriptionTokens()
					setSaveText("Updating")
					await loadRootFiles()
					await loadVideoFromInstance()
					setSaveLoading(false)
					setSaveText("Save")
					props.onCancel()
				}}
			/>
			<Timeline />
		</div>
	)
}
