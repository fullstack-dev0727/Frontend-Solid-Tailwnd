import { addActor, addAudioBatch, fetchFile, updateFileAudioData } from "@/api"
import { File } from "../../api/client/client.type"

export async function initVideoInstance(
	video_instance_id: string
): Promise<File> {
	const {
		data: [file],
	} = await fetchFile({ file_id: video_instance_id })

	console.log("file", JSON.stringify(file), file)

	let needsUpdate = false

	if (!file.audio_batch_id) {
		file.audio_batch_id = (
			await addAudioBatch({ name: "audio_batch:" + video_instance_id })
		).data.id
		needsUpdate = true
	}

	if (!file.actor_id) {
		file.actor_id = (
			await addActor({ name: "actor:" + video_instance_id })
		).data.id
		needsUpdate = true
	}

	if (needsUpdate) {
		await updateFileAudioData({
			file_id: video_instance_id,
			audio_batch_id: file.audio_batch_id,
			actor_id: file.actor_id,
		})
	}

	return file
}
