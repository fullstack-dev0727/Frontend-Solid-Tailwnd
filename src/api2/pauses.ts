import { json, Result } from "./ops"
import { bucket_key } from "./utils"

type Pauses = [number, number][]

export async function detectPauses(url: string) {
	const [audio_bucket, audio_key] = bucket_key(url)
	const { result } = await json<Result<Pauses>>(
		// fetch("https://voice.dev.bhuman.ai/detect_pauses", {
		fetch("https://voice-api.bhuman.ai/detect_pauses", {
			method: "POST",
			body: JSON.stringify({
				audio_bucket,
				audio_key,
				audio_region: "us-east-2", // TODO: remove hardcoded region
			}),
		})
	)
	return result
}
