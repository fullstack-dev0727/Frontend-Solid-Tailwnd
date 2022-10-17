import { bucket_key } from "../utils"
import { VoiceGenResult } from "./types"

// const generateVoiceUrl = "https://voice.dev.bhuman.ai/generate_audio"
const generateVoiceUrl =
	"https://voice-api.bhuman.ai/generate_audio_huggingface"

export async function generateVoice(
	transcripts: string[],
	templateUrl: string,
	output_bucket: string
): Promise<VoiceGenResult[]> {
	const [template_bucket, template_key] = bucket_key(templateUrl)
	const response = await fetch(generateVoiceUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			template_region: "us-east-2", // TODO: remove hardcoded region
			template_key,
			template_bucket,
			output_bucket,
			transcripts,
		}),
	})
	const data = await response.json()
	if (data.code !== 200) throw data

	// TODO: audio s3 urls
	return transcripts.map((t) => data.result[t])
}
