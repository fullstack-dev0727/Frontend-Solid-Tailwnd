import axios from "axios"

export const root = "https://api.dev.bhuman.ai/"

export type Result<T> =
	| { result: T; code: 200 | 201 }
	| { error: string; code: number; result: undefined }

export function authHeader() {
	return { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
}

export function jsonHeader() {
	return { "Content-Type": "application/json" }
}

export function corsHeader() {
	return [
		{ "Access-Control-Allow-Credentials": "false" },
		{ "Access-Control-Allow-Origin": "*" },
		{ "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
		{
			"Access-Control-Allow-Headers":
				"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Origin, Authorization",
		},
	]
}

export function get(endpoint: string, local_root?: string) {
	let env_root =
		import.meta.env.MODE == "stage"
			? local_root?.replace(".dev", ".stage")
			: import.meta.env.MODE == "dev"
			? local_root
			: local_root?.replace(".dev", "")
	return fetch((env_root ?? root) + endpoint, {
		method: "GET",
		headers: {
			...authHeader(),
			...jsonHeader(),
			...Object.assign({}, ...corsHeader()),
		},
	})
}

export function jsonFetch(
	method: "POST" | "PUT" | "DELETE",
	endpoint: string,
	body: unknown,
	local_root?: string
) {
	console.log(import.meta.env.MODE)
	let env_root =
		import.meta.env.MODE == "stage"
			? local_root?.replace(".dev", ".stage")
			: import.meta.env.MODE == "dev"
			? local_root
			: local_root?.replace(".dev", "")
	console.log(local_root, env_root)
	return fetch((env_root ?? root) + endpoint, {
		method,
		headers: {
			...authHeader(),
			...jsonHeader(),
			...Object.assign({}, ...corsHeader()),
		},
		body: JSON.stringify(body),
	})
}

export async function formXHR(
	method: "POST" | "PUT" | "DELETE",
	endpoint: string,
	data: FormData,
	onUploadProgress = (_: ProgressEvent) => {},
	local_root?: string
) {
	let env_root =
		import.meta.env.MODE == "stage"
			? local_root?.replace(".dev", ".stage")
			: import.meta.env.MODE == "dev"
			? local_root
			: local_root?.replace(".dev", "")
	await axios({
		method,
		url: (env_root ?? root) + endpoint,
		data,
		onUploadProgress,
		headers: {
			Authorization: "Bearer " + localStorage.getItem("access_token"),
		},
	})
}

export function formFetch(
	method: "POST" | "PUT" | "DELETE",
	endpoint: string,
	body: FormData
) {
	return fetch(root + endpoint, {
		method,
		headers: {
			...authHeader(),
			...Object.assign({}, ...corsHeader()),
			"Content-Type": "multipart/form-data",
		},
		body,
	})
}

export function post(endpoint: string, body: unknown, root?: string) {
	console.log(root)
	return jsonFetch("POST", endpoint, body, root)
}

export function put(endpoint: string, body: unknown, root?: string) {
	return jsonFetch("PUT", endpoint, body, root)
}

export function del(endpoint: string, local_root?: string) {
	let env_root =
		import.meta.env.MODE == "stage"
			? local_root?.replace(".dev", ".stage")
			: import.meta.env.MODE == "dev"
			? local_root
			: local_root?.replace(".dev", "")
	return fetch((env_root ?? root) + endpoint, {
		method: "DELETE",
		headers: {
			...authHeader(),
			...jsonHeader(),
			...Object.assign({}, ...corsHeader()),
		},
	})
}

export function query(endpoint: string, params: Record<string, string>) {
	return endpoint + "?" + new URLSearchParams(params).toString()
}

export async function json<T>(response: Promise<Response>) {
	return (await (await response).json()) as T
}

export async function blob(response: Promise<Response>) {
	return await (await response).blob()
}
