import { json, post, Result } from "../ops"

export type Pipeline2Request = {
	actor_id: string
	video_id: string
	ranges: [string, string][]
	rows: string[][]
	indices: number[]
	background_rows?: string[][]
	background_ranges?: [string, string][]
}

export async function postPipeline2(
	data: Pipeline2Request
): Promise<Result<any>> {
	return await json(
		post("api/ai_studio/pipeline", data, "https://studio.dev.bhuman.ai/")
	)
}
