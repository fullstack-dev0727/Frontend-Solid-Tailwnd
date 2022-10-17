import { files } from "@/api2"

let recorder!: MediaRecorder

const s3 = import.meta.env.VITE_TMP_BUCKET + "/"
// returns a function that when called stops the recording and returns the uploaded url
export async function recordAudio(): Promise<() => Promise<string>> {
	if (!recorder) {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
		recorder = new MediaRecorder(stream, {
			mimeType: "audio/webm;codecs=pcm",
		})
	}

	recorder.start()
	const chunks: Blob[] = []

	recorder.ondataavailable = (e) => {
		chunks.push(e.data)
	}

	return async () => {
		recorder.stop()

		const { result: root } = await files.root()
		const id = await files.pre_push(root.id, new Date().toJSON() + ".audio.webm")
		await files.push(id.result.file_id, new Blob(chunks, { type: "audio/webm" }))

		const { result } = await files.download(id.result.file_id)

		return s3 + result
	}
}
