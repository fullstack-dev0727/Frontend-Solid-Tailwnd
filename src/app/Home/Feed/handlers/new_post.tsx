import {
	createPost,
	get_presigned_url,
	// getPost,
	// deletePost,
	// updatePost,
} from "@/api2/feed/feed"
import { getUserFullName } from "../../../Settings/state"
import { state, handle_image_upload } from "../state"
import { fetchFeed, feedState } from "./fetch_feed"

// Handle new posts
export async function postContentHandler(body: {
	group_id: string
	description: string
	title?: string
	files?: FileList
}) {
	let payload = {
		description: body?.description ? body.description : "",
		fullname: getUserFullName(),
		group_id: body?.group_id
			? body.group_id
			: state.user?.id
			? state.user.id
			: "", // unexpected
		title: body?.title ? body.title : "",
		url: body?.files
			? await handle_image_upload(body.files, get_presigned_url)
			: "",
		user_avatar: state.user?.picture ? state.user.picture : null,
	}
	console.log("Post Uploading: ", payload)
	return await createPost(payload)
		.then(async (resp) => {
			if (resp.code === 200) {
				await fetchFeed(feedState.selectedGroup)
			}
			return resp
		})
		.catch((error) => {
			console.log("NEW POST ERROR: ", error)
			return error
		})
}
