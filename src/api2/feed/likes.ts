import { json, get, Result, post, del, query } from "../ops"
import { ROOT_POST } from "./env"

const endpoint = "api/feed/like"

export function like(payload: {
	fullname: string
	target_id: string
	user_avatar?: null | string
}): Promise<
	Result<{
		status?: string
	}>
> {
	return json(post(endpoint, payload, ROOT_POST))
}

export function unlike(target_id: string): Promise<
	Result<{
		status?: string
	}>
> {
	return json(del(query(endpoint, { target_id }), ROOT_POST))
}

export function getLikers(target_id: string): Promise<
	Result<{
		fullname?: string
		target_id: string
		user_avatar?: null | string
		user_id?: null | string
	}>
> {
	return json(get(query(endpoint, { target_id }), ROOT_POST))
}
