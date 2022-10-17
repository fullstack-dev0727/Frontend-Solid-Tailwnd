import { createStore } from "solid-js/store"
import { get, json, post, query, Result } from "../ops"

export type Audio = {
	id: string
	name: string
	url: string
}

type CreateAudio = {
	name: string
	actor_id: string
	url: string
	audio_length: string
}

export const audioCache: Record<string, Audio> = {}
export const audioCacheIAT: Record<string, number> = {}
export const [audioWatch, audioNotify] = createStore<Record<string, number>>({})
const cacheTTL = 1000 * 60 * 15 // 15 minutes

export async function find(name: string, actor_id: string) {
	name = name.toLowerCase()
	const key = `${name}-${actor_id}`
	if (audioCache[key] && audioCacheIAT[key] + cacheTTL > Date.now()) {
		return { result: audioCache[key], code: 200 }
	}
	const out = await json<Result<Audio>>(
		get(
			query("api/ai_studio/audio", { name, actor_id }),
			"https://studio.dev.bhuman.ai/"
		)
	)
	audioCache[key] = out.result

	audioCacheIAT[key] = Date.now()
	audioNotify(key, Date.now())
	audioNotify("all", Date.now())
	return out
}

export async function put(data: CreateAudio) {
	data.name = data.name.toLowerCase()
	const key = `${data.name}-${data.actor_id}`
	const out = await json<Result<Audio>>(
		post("api/ai_studio/audio", data, "https://studio.dev.bhuman.ai/")
	)
	audioCache[key] = out.result
	audioNotify(key, Date.now())
	audioNotify("all", Date.now())
	return out
}
