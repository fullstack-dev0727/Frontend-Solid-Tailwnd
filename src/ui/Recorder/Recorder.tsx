import { files } from "@/api2"
import { video_instances } from "@/api2/ai_studio"
import { loadTranscriptionTokens, loadRootFiles, loadVideoFromInstance, transcriptionProgress } from "@/app/AIStudio/Editor/state"
import {
    Component,
    createEffect,
    createSignal,
    onCleanup,
    onMount,
} from "solid-js"

import { state as appState } from "@/app/AIStudio/state"
import { formatDuration } from "@/app/AIStudio/Editor/FileManagerUI/FileManager/content/file"
import { RecorderBar, TimeContainer } from "./RecordControls"

export type RecorderState = "idle" | "recording" | "paused" | "playing" | "canPlay"

export const Recorder: Component<{
    width?: number
    height?: number
    onCancel?: () => void
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

    const onCancel = async () => {
        setPreviewUrl("")
        setCurrentTime("00:00:00")
        preview.currentTime = 0
        await setupPreview()
        preview.play()
    }

    return (
        <div class="w-[650px] h-[700px] flex flex-col items-center justify-between relative">
            <TimeContainer recorderState={recorderState()}>
                {currentTime() === "--" ? "00:00:00" : currentTime()}
            </TimeContainer>
            <video
                class="object-cover w-full h-full  rounded-[24px] absolute bg-slate-700"
                width={props.width}
                height={props.height}
                ref={preview}
                muted={recorderState() !== "playing"}
            />
            <div class="h-[150px] w-[650px] bg-gradient-to-b from-[#00000068] to-[#00000000]  absolute top-0 rounded-[24px]" />
            <div class="z-[99] mb-[38px] w-full">
                <RecorderBar
                    disabled={recorderState() !== "playing"}
                    saveText={saveText()}
                    saveLoading={saveLoading()}
                    recorderState={recorderState()}
                    onCancel={() => { setRecorderState("idle"); onCancel() }}
                    currentTime={currentTime()}
                    onPlay={() => {
                        setRecorderState("playing")
                        preview.play()
                        preview.onended = () => {
                            setRecorderState("paused")
                        }
                    }}
                    onPlayerPause={() => {
                        setRecorderState("paused")
                        preview.pause()
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

                        setRecorderState("canPlay")

                        setPreviewUrl(url)
                        setCurrentTime("00:00:00")
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
            </div>
            <div class="h-[150px] w-[650px] bg-gradient-to-b from-[#00000000] to-[#00000068] absolute bottom-0 rounded-[24px]" />
            {/* <Timeline /> */}
        </div>
    )
}

