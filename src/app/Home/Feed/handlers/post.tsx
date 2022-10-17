import { deletePost, updatePost } from "@/api2/feed/feed"
import { fetchFeed, feedState } from "./fetch_feed"

// Handle delete post
export async function deletePostHandler(target_id: string) {
	await deletePost(target_id)
		.then((resp) => {
			if (resp.code === 200) fetchFeed(feedState.selectedGroup)
			return resp
		})
		.catch((err) => {
			console.log("DELETE POST ERROR: ", err)
			return err
		})
}

// Handle update post
export async function updatePostHandler(
	id: string,
	title: string,
	description: string,
	pinned?: boolean
) {
	await updatePost({ id, title, description, pinned })
		.then((resp) => {
			if (resp.code === 200) fetchFeed(feedState.selectedGroup)
			return resp
		})
		.catch((err) => {
			console.log("UPDATE POST ERROR: ", err)
			return err
		})
}
