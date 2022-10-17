import { postComment } from "@/api2/feed/comment"
import { state } from "../state"
import { getUserFullName } from "../../../Settings/state"

// Handle new comments
export async function addComment(target_id: string, input: string) {
	const request = {
		comment: input,
		target_id: target_id,
		fullname: getUserFullName(),
		user_avatar: state.user?.picture ? state.user.picture : null,
	}
	console.log("Comment Uploading: ", request)

	return await postComment(request)
		.then(async (resp) => {
			// if (resp.code === 200) {}
			return resp
		})
		.catch((error) => {
			console.log("ADD COMMENT ERROR: ", error)
			return error
		})
}
