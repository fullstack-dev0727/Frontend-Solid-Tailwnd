import { fetchVideos, fetchFile } from "@/api"
import { FileData } from "."
import { getAudioBatchData } from "../../api"
import { state } from "@/app/AIStudio/state"
import { parseDuration } from "../../utils"
import { setFiles } from "../../state"

export async function loadAssets() {
	const videos: FileData[] = (await fetchVideos()).data.result.map(
		(v: any) => ({
			id: v.id,
			name: v.name,
			extension: "mp4",
			dateCreated: new Date(v.created_at),
			duration: parseDuration(v.length),
			size: 0,
		})
	)

	try {
		console.log(await getAudioBatchData(state.currentVideo))
	} catch {}

	setFiles(() => [...videos])
}
