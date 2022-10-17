import { createStore } from "solid-js/store"
import { Group, PostInfo } from "@/api2/feed/types"
import { like, unlike } from "@/api2/feed/likes"
import {
	state as UserState,
	fetchSettingsState,
	getUserFullName,
} from "../../Settings/state"
import { User } from "@/api2/user"
import { fetchFeed, fetchJoinedGroups } from "./handlers/fetch_feed"
import { Result } from "@/api2/ops"
import { fetchDiscoverableGroups } from "./handlers/group"
import { DEV_GROUP_IDS, PROD_GROUP_IDS } from "./DEFAULT_GROUPS"
import { joinGroup } from "@/api2/feed/group"

export const [state, setState] = createStore<{
	initiated: boolean
	loading: boolean
	groups_discoverable: Group[]
	groups_joined: Group[]
	FEED: PostInfo[]
	user: User
	group_names: any
	groups_created: string[]
}>({
	initiated: false,
	loading: true,
	groups_discoverable: null,
	groups_joined: null,
	FEED: null,
	user: null,
	group_names: null,
	groups_created: null,
})

const print_state = () => {
	console.log("FEED STATE: ", state)
}

export async function autoJoin(user: User) {
	if (!user || !user?.id) return
	// get static ids
	const STATIC_IDS =
		import.meta.env.MODE == "stage"
			? PROD_GROUP_IDS
			: import.meta.env.MODE == "dev"
			? DEV_GROUP_IDS
			: PROD_GROUP_IDS
	////////////////////////////////
	// get joined groups
	const joinedGroups = await fetchJoinedGroups()
	////////////////////////////////
	// join request if not included
	if (joinedGroups && joinedGroups.length === 0) {
		for (const id of STATIC_IDS) {
			console.log("Joining default group with id: ", id)
			await joinGroup(id)
				.then((resp) => {
					console.log("JOIN DEFAULT GROUP RESPONSE: ", resp)
				})
				.catch((e) => {
					console.log("JOIN DEFAULT GROUP ERROR: ", e)
				})
		}
		// fetch joined&discoverable groups to get updated state
		await fetchJoinedGroups().then(() => {
			fetchDiscoverableGroups()
		})
	}
}

export async function setupFeed() {
	setState("initiated", true)
	setState("loading", true)
	////////////////////////////////////////////////////////////////
	// GET USER
	if (!UserState.user)
		await fetchSettingsState(true).then((settingsStore) =>
			setState("user", settingsStore.user)
		)
	else setState("user", UserState.user)
	////////////////////////////////////////////////////////////////
	// SEARCH GROUPS DISCOVERABLE
	fetchDiscoverableGroups()
	////////////////////////////////////////////////////////////////
	// GET FEED
	await fetchFeed()
	////////////////////////////////////////////////////////////////
	print_state()
	setState("loading", false)
}

// Update items on FEED array by key&values: change rendered items to not fetch
export async function updatePostRender(
	post_id: string,
	values: { key: string; value: any }[]
) {
	if (!state.FEED || state.FEED.length == 0 || !post_id) return

	let _FEED: PostInfo[] = JSON.parse(JSON.stringify(state.FEED)) // Deep copy
	let index = _FEED.findIndex((post: PostInfo) => post.id === post_id)
	for (const { key, value } of values) {
		_FEED[index] = { ..._FEED[index], [`${key}`]: value }
	}
	setState("FEED", _FEED)
	console.log("FEED Updated", _FEED)
}

// Handle like action
export async function likePostHandler(post: PostInfo) {
	const update = (liked: boolean, likes: number) => {
		updatePostRender(post.id, [
			{ key: "liked", value: liked },
			{ key: "likes", value: likes },
		])
	}
	if (post.liked) {
		await unlike(post.id)
			.then((resp) => {
				if (resp.code === 200) update(!post.liked, post.likes - 1)
			})
			.catch((err) => {
				console.log("UNLIKE POST ERROR: " + err)
			})
	} else {
		await like({
			fullname: getUserFullName(),
			target_id: post.id,
			user_avatar: state.user?.picture ? state.user.picture : null,
		})
			.then((resp) => {
				if (resp.code === 200) update(!post.liked, post.likes + 1)
			})
			.catch((err) => {
				console.log("LIKE POST ERROR: " + err)
			})
	}
}

// request presigned_url from get_presigned_url_request parameter, uploads image, return public_url
export async function handle_image_upload(
	files: FileList,
	get_presigned_url_request: () => Promise<
		Result<{ presigned_url: string; public_url: string }>
	>
) {
	// Used array object for future if we enable multiple file uploads: for now, we will use 1 image since url field in Post Object is string, not array
	const file = files[0]
	const url = await setImage(file, get_presigned_url_request)
	return url
}

// Upload file to bucket; return public_url
export async function setImage(
	body: Blob,
	get_presigned_url: () => Promise<
		Result<{ presigned_url: string; public_url: string }>
	>
): Promise<string> {
	const resp = await get_presigned_url()
	if (resp.code !== 200) return ""
	const { presigned_url, public_url } = resp.result
	await fetch(presigned_url, {
		method: "PUT",
		body: await body.arrayBuffer(),
		headers: {
			"Content-Type": body.type,
			"Content-Length": body.size.toString(),
		},
	})
	return public_url
}
