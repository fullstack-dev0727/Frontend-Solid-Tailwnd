import { video_instances } from "@/api2/ai_studio";
import { get, json, query } from "@/api2/ops"
import { createSignal, createEffect, Show } from "solid-js";
import { state } from "../../state";
//import { TMP_BUCKET, S3_REGION, STATIC_BUCKET } from "../../Editor/Editor";


export const GeneratedVideo = (props: { emojiEnabled: boolean, id: string }) => {

  const STATIC_BUCKET = import.meta.env.VITE_STATIC_BUCKET;
  const S3_REGION = import.meta.env.VITE_S3_REGION;

  const [videoUrl, setVideoUrl] = createSignal<string>("");

  const hydrate = async () => {
    const {
      result: { actor_id, video_id },
    } = await video_instances.read({ id: state.currentVideo })

    const { result } = await json(
      get(
        query("api/ai_studio/generated_video", {
          actor_id,
          video_id,
        })
      )
    )
    const { url } = result[result.length - 1]

    let video_url = url.replace('s3', 'https').replace(`${STATIC_BUCKET}`, `${STATIC_BUCKET}.s3.${S3_REGION}.amazonaws.com`);

    setVideoUrl(video_url);
  }

  createEffect(hydrate);

  return (<div class="flex flex-col items-center">
    <video controls={true} src={videoUrl()} width={300} height={300}></video>
    <Show when={props.emojiEnabled}>
      <div class="flex bg-gray-200 w-fit rounded-md p-2">
        <span class="p-2 hover:bg-gray-300 cursor-pointer rounded-md text-3xl">&#128077;</span>
        <span class="p-2 hover:bg-gray-300 cursor-pointer rounded-md text-3xl">&#128079;</span>
        <span class="p-2 hover:bg-gray-300 cursor-pointer rounded-md text-3xl">&#128076;</span>
        <span class="p-2 hover:bg-gray-300 cursor-pointer rounded-md text-3xl">&#127881;</span>
      </div>
    </Show>
  </div>)
}
