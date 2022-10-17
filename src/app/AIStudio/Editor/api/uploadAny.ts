import { getVideoDuration, formatDuration } from "../utils"
import { ProgressListener } from "./types"
import axios from "axios"
import { root } from "@/api2/ops"
import { files, normalizeVideo } from "@/api2"

type UploadFeedback =
	| {
			type: "video"
			duration: number
			name: string
			id: string
			size: number
			ext: string
	  }
	| {
			type: "csv"
			name: string
			id: string
			size: number
			ext: string
	  }
	| { type: "error" }

export async function uploadAny(
	video_instance_id: string,
	file: File,
	onProgress: ProgressListener
): Promise<UploadFeedback> {
	const ext = file.name.split(".")[1]

	const { result: pid } = await files.root()
	const {
		result: { file_id },
	} = await files.pre_push(pid.id, file.name)

	const { result: s3_path } = await files.download(file_id)

	// const data = new FormData()
	// data.append("attach", file)

	console.log("uploading to", s3_path)

	await files.push(file_id, file, onProgress)

	// console.log("NORMALIZING VIDEO")
	// await normalizeVideo(import.meta.env.VITE_TMP_BUCKET, s3_path)

	// await axios({
	// 	method: "post",
	// 	url: root + "api/filemanager/push/" + file_id,
	// 	data,
	// 	onUploadProgress: onProgress,
	// 	headers: {
	// 		Authorization: "Bearer " + localStorage.getItem("access_token"),
	// 	},
	// })

	return {
		type: "video",
		duration: 0,
		name: file.name,
		id: "",
		size: file.size,
		ext,
	}
}
