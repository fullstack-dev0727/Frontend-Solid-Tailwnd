import { json, get, Result, put, post, del, query } from "../ops"
import { CreateGroup, Group, UpdateGroup } from "./types"
import { ROOT_GROUP } from "./env"

const endpoint = "api/group"

export function getGroup(id: string): Promise<Result<Group>> {
	return json(get(query(endpoint, { id }), ROOT_GROUP))
}

export function updateGroup(payload: UpdateGroup): Promise<Result<Group>> {
	return json(put(endpoint, payload, ROOT_GROUP))
}

export function createGroup(payload: CreateGroup): Promise<Result<Group>> {
	return json(post(endpoint, payload, ROOT_GROUP))
}

export function deleteGroup(id: string): Promise<
	Result<{
		status?: string
	}>
> {
	return json(del(query(endpoint, { id }), ROOT_GROUP))
}

export function get_group_presigned_url(): Promise<
	Result<{ presigned_url: string; public_url: string }>
> {
	return json(get(endpoint + "/presigned_url", ROOT_GROUP))
}

export function getJoinedGroups(): Promise<Result<Group[]>> {
	return json(get(endpoint + "/joined", ROOT_GROUP))
}

export function joinGroup(id: string): Promise<Result<void>> {
	return json(get(endpoint + "/join/" + id, ROOT_GROUP))
}

export function leaveGroup(id: string): Promise<Result<void>> {
	return json(del(endpoint + "/leave/" + id, ROOT_GROUP))
}

export function searchGroup(
	page: number,
	size: number,
	search?: string
): Promise<Result<Group[]>> {
	const _query = {
		page: String(page),
		search: search ? search : null,
		size: String(size),
	}
	if (!search) delete _query.search
	return json(get(query(endpoint + "/search", _query), ROOT_GROUP))
}
