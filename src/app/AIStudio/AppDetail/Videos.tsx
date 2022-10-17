
import { For, createSignal, createEffect, untrack, Show } from 'solid-js';
import { FileIcon } from '@/ui/AppMenu/FileIcon';
import { useNavigate } from "solid-app-router";
import { state as panelState } from '../Panel/state';
import { state } from '../state';
import { setTabId } from '../Editor/EditorLeft';
import { GeneratedVideo, getGeneratedVideos, video_instances } from '@/api2/ai_studio';
import { setGeneratedVideos, updateTabCount } from '../Panel/state';
import { Popup } from '@/ui/Popup/Popup';
import { Iframe } from '@/ui/Iframe/Iframe';

async function loadGeneratedVideos() {
	const {
		result: { video_id, actor_id },
	} = await video_instances.read({ id: state.currentVideo })


	try {
		if (video_id) {
			const { result } = await getGeneratedVideos(actor_id, video_id)
			return result
		}
		return []
	}
	catch (e) {
		return []
	}
}

export const [showGeneratedVideo, setShowGeneratedVideo] = createSignal(false)

export const Videos = () => {
	const navigate = useNavigate()
	// route.query.searchStartDate;

	createEffect(async () => {
		void state.currentVideo

		const generatedVideos: GeneratedVideo[] = await loadGeneratedVideos()
		setGeneratedVideos(generatedVideos)
		updateTabCount({ name: "Videos", count: generatedVideos.filter((v) => v.status === "succeeded").length })
	})

	return (
		<section>
			<div class="bg-black/[0.04] rounded-[16px] p-[16px] select-text">
				<div class="text-[17px] leading-[24px] font-[Inter] flex">
					<div class="text-black/[0.9] font-semibold">
						Videos
					</div>
					<div class="ml-[4px] text-black/[0.6] font-normal ">
						{panelState.generatedVideos.filter(v => v.status === "succeeded").length}
					</div>
					<div class="text-[15px] leading-[18px] font-medium text-black/[0.9] mr-0 ml-auto cursor-pointer " onClick={() => { navigate((window.location.href.includes("videos")?"../editor/": "./editor/") + state.currentVideo); setTabId("assets"); }}>
						See all
					</div>
				</div>
				<div class="mt-[16px] flex flex-wrap gap-2">
					<For each={panelState.generatedVideos} >{(item, i) =>
						<Show when={item.status === "succeeded"}>
							<div onclick={() => { window.open(item.vimeo_url, "samewindow", "toolbar=no, scrollbars=no, resizable=no, top=200, left=300, width=870, height=650"); }}>
								{/* <div onclick={() => setShowGeneratedVideo(true)}> */}
								<FileIcon />
								{/* <Show when={showGeneratedVideo()}>
									<Popup onCancel={() => setShowGeneratedVideo(false)} submit="false">
										<Iframe src={item.vimeo_url}></Iframe>
									</Popup>
								</Show> */}
							</div>
						</Show>
					}</For>
				</div>

			</div>

		</section >
	)
}



export default Videos


