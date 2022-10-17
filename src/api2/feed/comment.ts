import { json, get, Result, post, query } from "../ops"
import { Comment } from "./types"
import { ROOT_POST } from "./env"

const endpoint = "api/feed/comment"

export function getComment(
	page: number,
	size: number,
	target_id: string
): Promise<Result<Comment[]>> {
	return json(
		get(
			query(endpoint, {
				page: String(page),
				size: String(size),
				target_id,
			}),
			ROOT_POST
		)
	)
}

export function postComment(payload: {
	comment: string
	fullname: string
	target_id: string
	user_avatar?: null | string
}): Promise<Result<Comment>> {
	return json(post(endpoint, payload, ROOT_POST))
}
