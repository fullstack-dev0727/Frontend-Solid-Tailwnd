import { Group, PostInfo } from "@/api2/feed/types"
import { getJoinedGroups } from "@/api2/feed/group"
import { getPost, fetchPosts } from "@/api2/feed/feed"
import { state, setState, autoJoin } from "../state"
import { createStore } from "solid-js/store"

const SIZE = 30

export const [feedState, setFeedState] = createStore<{
	size: number
	page: number
	feed: PostInfo[]
	selectedGroup: string
	feedLoading: boolean
	pageLoading: boolean
	pageEnd: boolean
}>({
	size: SIZE,
	page: 0,
	feed: [],
	selectedGroup: null,
	feedLoading: false,
	pageLoading: false,
	pageEnd: false,
})

// Fetch Feed
export async function fetchFeed(group_id?: string, isPage?: boolean) {
	if (!group_id) setFeedState("selectedGroup", null) // checked before fetches to fix rendering

	if (!isPage) {
		// Initial fetch
		setFeedState("feedLoading", true)
		setFeedState("page", 0)
		setFeedState("pageEnd", false)
		// Get Joined Groups
		const joinedGroups = await fetchJoinedGroups()
		if (joinedGroups && joinedGroups.length === 0) {
			await autoJoin(state?.user)
		}
	}

	if (!group_id) {
		// Fetch Main Feed
		await fetchMainFeed(isPage)
	} else {
		// Fetch Group Feed
		await fetchGroupFeed(group_id, isPage)
	}
	setFeedState("feedLoading", false)
}

async function fixArrayForFeed(list: PostInfo[]): Promise<PostInfo[]> {
	if (!list || list.length === 0) return []
	const deepCopiedList: PostInfo[] = JSON.parse(JSON.stringify(list))
	let newList = deepCopiedList.sort((a, b) => {
		let date1 = new Date(a.created_at)
		let date2 = new Date(b.created_at)
		return date2.getTime() - date1.getTime()
	})
	// .filter(function (item, pos, self) {
	// 	return self.indexOf(item) == pos
	// })
	const pinnedPosts: PostInfo[] = []

	newList.forEach((post, i) => {
		if (post.pinned) {
			pinnedPosts.push(post)
		}
	})
	pinnedPosts.forEach((post, i) => {
		const index = newList.findIndex((_post) => post.id === _post.id)
		if (index > -1) newList.splice(index, 1)
	})
	return pinnedPosts.concat(newList)
}

async function fetchMainFeed(isPage?: boolean) {
	setFeedState("selectedGroup", null)
	// Get Profile Posts
	// const profile_posts = await getProfilePosts()
	// Get Groups Posts
	const group_posts = await getJoinedGroupsPosts(true)
	// Sort posts by date (array of length = SIZE)
	const feed_joined = group_posts.sort((a, b) => {
		let date1 = new Date(a.created_at)
		let date2 = new Date(b.created_at)
		return date2.getTime() - date1.getTime()
	})
	if (isPage) {
		if (feed_joined.length === 0) {
			setFeedState("pageEnd", true)
		} else {
			const newList = JSON.parse(JSON.stringify(feedState.feed)).concat(
				feed_joined
			)
			setFeedState("feed", await fixArrayForFeed(newList))
			setState("FEED", await fixArrayForFeed(newList))
		}
	} else {
		setFeedState("feed", await fixArrayForFeed(feed_joined))
		setState("FEED", await fixArrayForFeed(feed_joined))
	}
}

async function fetchGroupFeed(group_id: string, isPage?: boolean) {
	setFeedState("selectedGroup", group_id)
	// Get Selected Group Posts
	const group_posts = await getGroupPosts(group_id)
	// Sort posts by date (array of length = SIZE)
	const posts = group_posts.sort((a, b) => {
		let date1 = new Date(a.created_at)
		let date2 = new Date(b.created_at)
		return date2.getTime() - date1.getTime()
	})
	if (isPage) {
		if (posts.length === 0) setFeedState("pageEnd", true)
		else {
			const newList = JSON.parse(JSON.stringify(feedState.feed)).concat(posts)
			setFeedState("feed", await fixArrayForFeed(newList))
			setState("FEED", await fixArrayForFeed(newList))
		}
	} else {
		setFeedState("feed", await fixArrayForFeed(posts))
		setState("FEED", await fixArrayForFeed(posts))
	}
}

export async function fetchJoinedGroups() {
	return await getJoinedGroups()
		.then((resp) => {
			if (resp.code === 200) {
				setState("groups_joined", resp.result)
				let groupNames: any = {}
				let groups_created: string[] = []
				resp.result.forEach((group) => {
					groupNames[`${group.id}`] = group.name
					if (group.user_id === state.user?.user_id)
						groups_created.push(group.id)
				})
				setState("groups_created", groups_created)
				setState("group_names", groupNames)
				return resp.result
			} else {
				console.log("GET JOINED GROUPS ERROR: ")
				setState("groups_joined", [])
				setState("group_names", {})
				setState("groups_created", [])
				return []
			}
		})
		.catch((e) => {
			// TODO: handle error
			console.log("GET JOINED GROUPS ERROR: ", e)
			return []
		})
}

export async function updatePagination(page?: number) {
	if (!feedState.pageEnd && !feedState.feedLoading) {
		console.log("Page updating...")
		setFeedState("page", page ? page : feedState.page + 1)
		setFeedState("pageLoading", true)
		await fetchFeed(feedState.selectedGroup, true)
		setFeedState("pageLoading", false)
	}
}

export async function setSelectedGroup(group_id: string) {
	if (!group_id || feedState.selectedGroup === group_id) {
		setFeedState("selectedGroup", null)
		fetchFeed()
	} else {
		setFeedState("selectedGroup", group_id)
		fetchFeed(group_id)
	}
}

export async function getJoinedGroupsPosts(
	hasProfilePosts?: boolean
): Promise<PostInfo[]> {
	let JOINED_LIST: Group[] = []
	if (!state.groups_joined || state.groups_joined.length < 1) JOINED_LIST = []
	else JOINED_LIST = state.groups_joined

	let group_ids: string[] = []
	let groupNames: any = {}
	JOINED_LIST.forEach((group) => {
		group_ids.push(group.id)
		groupNames[`${group.id}`] = group.name
	})
	setState("group_names", groupNames)

	if (hasProfilePosts) group_ids.push(state.user.id)

	const list: PostInfo[] = await fetchPosts(group_ids, feedState.page, SIZE)
		.then((resp) => {
			if (resp.code === 200) return resp.result
			else {
				console.log("GET JOINED GROUPS POSTS ERROR", resp)
				return []
			}
		})
		.catch((e) => {
			// TODO: handle error
			console.log("GET JOINED GROUPS POSTS ERROR", e)
			return []
		})
	return list
}

export async function getGroupPosts(group_id: string): Promise<PostInfo[]> {
	if (!group_id) return []

	const list: PostInfo[] = await getPost(group_id, feedState.page, SIZE)
		.then((resp) => {
			if (resp.code === 200) return resp.result
			else {
				console.log("GET GROUP POSTS ERROR")
				return []
			}
		})
		.catch((e) => {
			// TODO: handle error
			console.log("GET GROUP POSTS ERROR", e)
			return []
		})
	return list
}

// export async function getProfilePosts(): Promise<PostInfo[]> {
// 	return await getPost(state.user.id, feedState.page, SIZE, state.user.user_id)
// 		.then((resp) => {
// 			if (resp.code === 200) return resp.result
// 			else {
// 				console.log("GET PROFILE POSTS ERROR", resp)
// 				return []
// 			}
// 		})
// 		.catch((e) => {
// 			// TODO: handle error
// 			console.log("GET PROFILE POSTS ERROR", e)
// 			return []
// 		})
// }
