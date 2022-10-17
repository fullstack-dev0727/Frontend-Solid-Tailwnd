import { json, get, Result, put, post, del, query } from "../ops"
import { PostInfo } from "./types"
import { ROOT_POST } from "./env"

const endpoint = "api/feed/post"

export function fetchPosts(
	group_id: string[],
	page: number,
	size: number,
	user_id?: string
): Promise<Result<PostInfo[]>> {
	const payload: {
		group_id: string[]
		page: number
		size: number
		user_id?: string
	} = {
		group_id: group_id,
		page: page,
		size: size,
	}
	if (user_id) payload.user_id = user_id
	return json(post("api/feed/fetch", payload, ROOT_POST))
}

export function getPost(
	group_id: string,
	page: number,
	size: number,
	user_id?: string
): Promise<Result<PostInfo[]>> {
	const _query = {
		group_id: group_id,
		page: String(page),
		size: String(size),
		user_id: user_id,
	}
	if (!user_id) delete _query.user_id
	return json(get(query(endpoint, _query), ROOT_POST))
}

export function deletePost(id: string): Promise<
	Result<{
		status?: string
	}>
> {
	return json(del(query(endpoint, { id }), ROOT_POST))
}

export function createPost(payload: {
	description?: string
	fullname: string
	group_id: string
	title?: string
	url: null | string
	user_avatar?: null | string
}): Promise<Result<PostInfo>> {
	return json(post(endpoint, payload, ROOT_POST))
}

export function updatePost(payload: {
	description?: null | string
	id: string
	title?: null | string
	pinned?: boolean
}): Promise<Result<PostInfo>> {
	return json(put(endpoint, payload, ROOT_POST))
}

export function get_presigned_url(): Promise<
	Result<{ presigned_url: string; public_url: string }>
> {
	return json(get("api/feed/presigned_url", ROOT_POST))
}
