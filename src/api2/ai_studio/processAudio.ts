import { json, post } from "../ops"
import { bucket_key } from "../utils"

const OUT_BUCKET = import.meta.env.VITE_ASSETS_BUCKET

export async function processAudio(templateUrl: string, audioUrl: string) {
	return audioUrl
	const [template_bucket, template_key] = bucket_key(templateUrl)
	const [audio_bucket, audio_key] = bucket_key(audioUrl)

	const {
		result: { audio_assets },
	} = await json(
		post(
			"/process_audio",
			{
				template_bucket,
				template_key,
				audio_bucket,
				audio_assets: [audio_key],
				denoise: false,
				silence_removal: false,
				amplitude_equalize: false,
			},
			"https://voice.bhuman.ai"
		)
	)

	return OUT_BUCKET + JSON.parse(audio_assets)[audio_key]
}

export async function processTemplate(url: string) {
	const [template_bucket, template_key] = bucket_key(url)

	const {
		result: { template },
	} = await json(
		post(
			"/process_audio",
			{
				template_bucket,
				template_key,
				audio_bucket: "",
				audio_assets: [],
				denoise: false,
				silence_removal: false,
				amplitude_equalize: false,
			},
			// "https://voice.dev.bhuman.ai"
			"https://voice-api.bhuman.ai"
		)
	)

	return OUT_BUCKET + template
}
