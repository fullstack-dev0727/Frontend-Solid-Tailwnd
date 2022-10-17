import { formFetch, formXHR, get, json, post, Result } from "./ops"

type RootResult = Result<{id:string}>

type PrePushResult = Result<{file_id:string}>

type FileInfo = {
	created_at: string
	deleted: 0 | 1
	id: string
	is_folder: 0 | 1
	name: string
	path: string
	url: string
	pid: string
	length: number
	status: 0 | 1 // 0: not uploaded, 1: uploaded
	updated_at: string
	user_id: string
}

type FileResult = Result<FileInfo>

type DirResult = Result<FileInfo[]>

export function root(): Promise<RootResult> {
	return json<RootResult>(get("api/filemanager/fs", "https://file.dev.bhuman.ai/"))
}

export async function list(id: string) {
	return await json<DirResult>(get("api/filemanager/fs/" + id, "https://file.dev.bhuman.ai/"))
}

export async function pull(id: string) {
	const res = await get("api/filemanager/pull/" + id, "https://file.dev.bhuman.ai/")
	return res.blob()
}

export async function pre_push(pid: string, name: string): Promise<PrePushResult> {
	return (
		await post("api/filemanager/pre_push/" + pid, {
			user_id: localStorage.getItem("user_id"),
			file_name: name,
			file_size: 0,
		}, "https://file.dev.bhuman.ai/")
	).json()
}

export async function push(id: string, blob: Blob,onProgress?: (e: ProgressEvent) => void) {
	const data = new FormData()
	data.append("attach", blob)
	return await formXHR("POST", "api/filemanager/push/" + id, data, onProgress, "https://file.dev.bhuman.ai/")
}

export async function download(id: string) {
	return await json<Result<string>>(get("api/filemanager/download/" + id, "https://file.dev.bhuman.ai/"))
}
