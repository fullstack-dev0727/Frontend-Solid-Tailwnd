import { Folder, VideoInstance } from "./ai_studio"
import { json, get, Result, put, post, del } from "./ops"
import { Workspace } from "./types"

export type UserCreate = Omit<
	Partial<User>,
	"first_name" | "last_name" | "email"
> & {
	first_name: string
	last_name: string
	email: string
	picture?: string
}

// export type User = {
// 	bio: string
// 	dob: string
// 	email: string
// 	first_name: string
// 	gender: string
// 	last_login_ip: string
// 	last_name: string
// 	latitude: string
// 	longitude: string
// 	phone_number: string
// 	picture: string
// 	two_fator: string
// 	user_account_type: string
// 	username: string
// }

export type User = {
	app_ids?: string[]

	bio?: string
	dob?: string
	email: string
	first_name: string
	gender?: string
	id: string
	invite_users?: []

	last_at: string
	last_login_ip?: string
	last_name: string
	latitude?: number
	longitude?: number
	organization?: []

	phone_number?: string
	picture?: string
	plan_id: string
	post_ids?: []

	referred_by?: string
	two_fator?: boolean
	user_account_type?: string
	user_id: string
	username?: string
	workspace_ids?: []
}

export function read(): Promise<Result<User>> {
	return json(get("api/user","https://user.dev.bhuman.ai/"))
}

export function update(user: Partial<User>): Promise<Result<User>> {
	return json(put("api/user", user,"https://user.dev.bhuman.ai/"))
}

export function create(user: UserCreate): Promise<
	Result<{
		folder?: Folder
		instance?: VideoInstance
		user: User
		workspace?: Workspace
	}>
> {
	return json(post("api/user", user,"https://user.dev.bhuman.ai/"))
}

export function remove(): Promise<Result<void>> {
	return json(del("api/user","https://user.dev.bhuman.ai/"))
}

export async function setProfilePicture(
	body: Blob
): Promise<string | undefined> {
	const presigned = await json<
		Result<{
			presigned_url: string
			public_url: string
		}>
	>(get("api/user/presigned_url","https://user.dev.bhuman.ai/"))
	console.log(body, presigned)
	if (presigned.code !== 200) return undefined
	await fetch(presigned.result.presigned_url, {
		method: "PUT",
		body: await body.arrayBuffer(),
		headers: {
			"Content-Type": body.type,
			"Content-Length": body.size.toString(),
		},
	})
	return presigned.result.public_url
}
