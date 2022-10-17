import {
	createGroup,
	get_group_presigned_url,
	joinGroup,
	leaveGroup,
	searchGroup,
	// getGroup,
	updateGroup,
	deleteGroup,
	// getJoinedGroups,
} from "@/api2/feed/group"
import { CreateGroup, UpdateGroup } from "@/api2/feed/types"
import { handle_image_upload, setState } from "../state"
import { fetchFeed } from "./fetch_feed"

export async function joinGroupHandler(id: string) {
	const success = await joinGroup(id)
		.then((resp) => {
			if (resp.code === 200) {
				fetchFeed(id)
				return true
			} else return false
		})
		.catch((err) => {
			console.log("JOIN GROUP ERROR: ", err)
			return false
		})
	return success
}

export async function leaveGroupHandler(id: string) {
	const success = await leaveGroup(id)
		.then((resp) => {
			if (resp.code === 200) {
				fetchFeed()
				return true
			} else return false
		})
		.catch((err) => {
			console.log("LEAVE GROUP ERROR: ", err)
			return false
		})
	return success
}

export async function createGroupHandler(payload: CreateGroup) {
	console.log("payload", payload)
	if (!payload || !payload?.name) return false

	if (payload?.logo)
		payload.logo = await handle_image_upload(
			// @ts-ignore
			payload.logo,
			get_group_presigned_url
		)

	if (payload?.cover)
		payload.cover = await handle_image_upload(
			// @ts-ignore
			payload.cover,
			get_group_presigned_url
		)

	const success = await createGroup(payload)
		.then(async (resp) => {
			if (resp.code === 200) {
				await fetchDiscoverableGroups()
				await fetchFeed(resp.result.id)
				return true
			} else return false
		})
		.catch((err) => {
			console.log("CREATE GROUP ERROR: ", err)
			return false
		})
	return success
}

export async function updateGroupHandler(payload: UpdateGroup) {
	console.log("payload", payload)
	if (!payload || !payload?.name) return false

	if (payload?.logo)
		payload.logo = await handle_image_upload(
			// @ts-ignore
			payload.logo,
			get_group_presigned_url
		)

	if (payload?.cover)
		payload.cover = await handle_image_upload(
			// @ts-ignore
			payload.cover,
			get_group_presigned_url
		)

	const success = await updateGroup(payload)
		.then(async (resp) => {
			if (resp.code === 200) {
				await fetchDiscoverableGroups()
				await fetchFeed(resp.result.id)
				return true
			} else return false
		})
		.catch((err) => {
			console.log("UPDATE GROUP ERROR: ", err)
			return false
		})
	return success
}

export async function fetchDiscoverableGroups() {
	searchGroup(0, 100)
		.then((resp) => setState("groups_discoverable", resp.result))
		.catch((e) => {
			// TODO: handle error
			console.log("SEARCH GROUP ERROR: ", e)
			setState("groups_discoverable", [])
		})
}

// Handle delete group
export async function deleteGroupHandler(group_id: string) {
	await deleteGroup(group_id)
		.then((resp) => {
			if (resp.code === 200) {
				fetchFeed()
				fetchDiscoverableGroups()
			}
			return resp
		})
		.catch((err) => {
			console.log("DELETE GROUP ERROR: ", err)
			return err
		})
}
