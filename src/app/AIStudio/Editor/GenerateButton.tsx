import {
	GeneratedVideo,
	generated_page,
	getGeneratedVideos,
	video_instances,
} from "@/api2/ai_studio"
import { audioWatch } from "@/api2/ai_studio/audios"
import { WandIcon } from "@/ui/icons"
import { Spinner } from "@/ui/icons/Spinner"
import { createEffect, createSignal, Show } from "solid-js"
import { createStore } from "solid-js/store"
import { currentPage, state as appState } from "../state"
import { getSegmentedCells } from "./api/generatePipeline"
import {
	cacheIndices,
	generateVideos,
	preparePipelineRequest,
} from "./generateVideos"
import { muxGetSet } from "./Spreadsheet"
import { state } from "./state"

export const [generationState, setGenerationState] = createStore<{
	processing: number
	succeeded: number
	failed: number
	total: number
}>({
	processing: 0,
	succeeded: 0,
	failed: 0,
	total: 0,
})

export const [generationRows, setGenerationRows] = createStore<
	Record<number, GeneratedVideo>
>({})

export const GenerateButton = () => {
	const [generating, setGenerating] = createSignal(false)
	const [starting, setStarting] = createSignal(false)

	let poller: NodeJS.Timeout = null

	async function poll(): Promise<void> {
		clearTimeout(poller)
		const {
			result: { video_id, actor_id },
		} = await video_instances.read({ id: appState.currentVideo })

		if (!actor_id || !video_id) return

		const rows: Record<number, GeneratedVideo> = {}
		const { result } = await getGeneratedVideos(actor_id, video_id)

		const values = Object.values(cacheIndices())
		for (const v of result) {
			if (values.includes(v.row_index)) {
				rows[v.row_index] = v
			}
		}

		let processing = 0
		let succeeded = 0
		let failed = 0

		for (const v of Object.values(rows)) {
			if (v.status === "processing") processing++
			else if (v.status === "succeeded") succeeded++
			else if (v.status === "failed") failed++
		}

		setGenerationRows(rows)

		if (processing) setGenerating(true)

		setGenerationState({
			processing,
			succeeded,
			failed,
			total: processing + succeeded + failed,
		})

		if (!processing) {
			setGenerating(false)
			return
		}

		preparePipelineRequest()

		poller = setTimeout(poll, 5000)
	}

	function generatePage() {
		let sheet_rows = Object.keys(cacheIndices()).length

		let interval: NodeJS.Timer

		interval = setInterval(async () => {
			const {
				result: { video_id, id, actor_id },
			} = await video_instances.read({ id: appState.currentVideo })

			if (!actor_id || !video_id) return

			const { result } = await getGeneratedVideos(actor_id, video_id)

			let c = () => {
				let success = false
				for (let i = 0; i < sheet_rows; i++) {
					if (videos[i].status != "succeeded") {
						success = false
						break
					} else {
						success = true
					}
				}
				return success
			}

			let videos = result.reverse()

			let page = currentPage()

			if (page && !page.settings.vimeo_enabled) {
				console.log("GENERATING PAGE")

				if (c()) {
					let widgets = page.widgets.map((w) => {
						if (w.name == "video") {
							let urls: string[] = []
							for (let i = 0; i < sheet_rows; i++) {
								urls.push(videos[i].url)
							}
							let url = urls
								.map((u: string) =>
									u
										.replace("s3", "https")
										.replace(
											"bhuman-platform-static",
											"bhuman-platform-static.s3.us-east-1.amazonaws.com"
										)
								)
								.join(",")
							return { data: url, name: w.name, id: w.id }
						} else {
							return { data: w.data, name: w.name, id: w.id }
						}
					})

					clearInterval(interval)
					await generated_page.create({
						page: {
							name: "Default",
							video: page.video,
							video_instance: id,
							vimeo_enabled: page.settings.vimeo_enabled,
							comments_enabled: page.settings.comments_enabled,
							emoji_enabled: page.settings.emoji_enabled,
							default_template: page.settings.default_template,
						},
						widgets: widgets,
					})
					const env =
						import.meta.env.MODE == "stage"
							? ".stage"
							: import.meta.env.MODE == "dev"
							? ".dev"
							: ""
					alert(
						`page has been generated https://videos${env}.bhuman.ai/videos/${page.video}?videoId=${result[0].id}&videoIndex=0`
					)
				}
			} else {
				clearInterval(interval)
			}
		}, 5000)
	}

	poll()

	const [disabled, setDisabled] = createSignal(true)

	createEffect(() => {
		void audioWatch.all
		void appState.currentVideo
		void state.videoUrl
		if (muxGetSet.get.sheets.length === 0) return
		console.log("GENERATE BUTTON: PREPAREING PIPELINE REQUEST")
		getSegmentedCells(
			muxGetSet,
			state.segments.map((s) => s.name)
		)
		void preparePipelineRequest().then((r) => setDisabled(!r))
		poll()
	})

	return (
		<div class="flex rounded-lg overflow-hidden gap-[2px]">
			<button
				disabled={generating() || disabled()}
				class="py-2 px-3 font-[13px] font-semibold text-white font-[Inter] flex items-center gap-2 duration-75"
				onClick={async () => {
					setStarting(true)
					if (await generateVideos()) {
						await poll()
						generatePage()
					}
					setStarting(false)
				}}
				classList={{
					"cursor-not-allowed text-black bg-gray-300": generating(),
					"cursor-not-allowed bg-gray-300": disabled(),
					"hover:bg-[#3A9AE0] bg-[#4EADF1]": !generating() && !disabled(),
				}}
			>
				<Show
					fallback={
						<Show
							when={!starting()}
							fallback="Starting..."
						>
							<WandIcon size={12} />
							Generate
						</Show>
					}
					when={generating()}
				>
					<Spinner height="h-6 mr-[-5px]" />
					{generationState.succeeded}/{generationState.total}
				</Show>
			</button>
		</div>
	)
}
