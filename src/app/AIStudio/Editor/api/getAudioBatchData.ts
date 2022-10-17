import axiosApi from "@/api"

export function getAudioBatchData(video_instance_id: string) {
	return axiosApi.get(
		"/audio_batch_data?video_instance_id=" + video_instance_id
	)
}
