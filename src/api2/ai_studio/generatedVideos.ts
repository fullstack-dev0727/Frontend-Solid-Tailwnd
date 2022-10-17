import { get, json, query, Result } from "../ops"

export type GeneratedVideoStatus = "processing" | "succeeded" | "failed"

export type GeneratedVideo = {
	id: string
	user_id: string
	video_id: string
	actor_id: string
	row_index: number
	url?: string
	vimeo_url?: string
	thumbnail?: string
	status: GeneratedVideoStatus
	created_at: string
	updated_at: string
}

export function getGeneratedVideos(
	actor_id: string,
	video_id: string,
	row_index?: number
) {
	const params: Record<string, string> = {
		actor_id,
		video_id,
	}
	if (row_index !== undefined) {
		params.row_index = row_index.toString()
	}
	return json<Result<GeneratedVideo[]>>(
		get(query("api/ai_studio/generated_video", params), "https://studio.dev.bhuman.ai/"),
	)
}
