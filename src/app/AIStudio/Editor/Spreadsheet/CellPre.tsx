import { audios } from "@/api2/ai_studio"
import { processAudio } from "@/api2/ai_studio/processAudio"
import { MicrophoneIcon, PlayIcon, VideoTapeIcon } from "@/assets/icons"
import { Spinner } from "@/ui/icons/Spinner"
import {
	Component,
	createEffect,
	createSignal,
	Match,
	Show,
	Switch,
} from "solid-js"
import { state, S3_REGION } from "../state"
import { actorId } from "../ActorSelect"
import { recordAudio } from "./recordAudio"
import { CellPreProps } from "./src"
import { audioCache, audioCacheIAT, audioWatch } from "@/api2/ai_studio/audios"
import { FileIcon } from "@/ui/icons/FileIcon"

type Action = "idle" | "recording" | "loading" | "playing"

const [targetName, setTargetName] = createSignal<string>("")
const [action, setAction] = createSignal<Action>("idle")

function hole(_: unknown) {}
let stop: () => Promise<string>
const isBusy = () =>
	action() === "playing" || action() === "recording" || action() === "loading"

export const CellPre: Component<CellPreProps> = (props) => {
	const id = () => props.cellData.content
	const is = (a: Action) => a === action() && id() === targetName()

	const [audioUrl, setAudioUrl] = createSignal("")

	createEffect(() => {
		if (props.y === 0) return
		const key = props.cellData.content.toLowerCase() + "-" + actorId()
		hole(audioWatch[key]) // do not remove as it has side effects
		const audio = audioCache[key]
		const iat = audioCacheIAT[key]
		if (audio && iat && iat > Date.now() - 1000 * 60 * 15) {
			setAudioUrl(audio.url)
		} else {
			setAudioUrl("")
			if (props.cellData.content && actorId()) {
				audios.find(props.cellData.content, actorId())
			}
		}
	})

	return (
		<div class="flex items-center pl-1">
			<Show
				when={
					(props.cellData.content ||
						props.cellData.input ||
						props.cellData.url) &&
					props.y
				}
			>
				<Switch>
					<Match when={props.cellData.content.startsWith("file:")}>
						<span class="w-6 h-6">
							<FileIcon size={22} />
						</span>
					</Match>
					<Match when={props.cellData.url}>
						<a
							class="hover:text-blue-500"
							href={props.cellData.url}
							target="_blank"
						>
							<VideoTapeIcon />
						</a>
					</Match>
					<Match when={props.cellData.input}>
						<span></span>
					</Match>
					<Match when={is("loading")}>
						<div class="ml-1 mr-[-10px]">
							<Spinner
								width="w-5"
								height="h-5"
							/>
						</div>
					</Match>
					<Match when={is("recording")}>
						<div
							title={"Stop recording"}
							class="w-3 h-3 m-1 bg-red-500 rounded-full border-black border-2 animate-pulse"
							onClick={async () => {
								setAction("loading")
								const url = await stop()
								console.log("recording stopped", url)
								await audios.put({
									name: targetName(),
									actor_id: actorId(),
									url,
									audio_length: "00:00:00:00",
								})
								setAction("idle")
								setAudioUrl(url)
								setTargetName("")
							}}
						/>
					</Match>
					<Match when={true}>
						<span
							class="cursor-pointer"
							title="Record audio"
							onClick={async () => {
								setTargetName(id())
								setAction("loading")
								stop = await recordAudio()
								setAction("recording")
							}}
							classList={{
								"opacity-20 cursor-not-allowed": isBusy(),
							}}
						>
							<MicrophoneIcon
								size={8}
								height="h-1"
							/>
						</span>
					</Match>
				</Switch>

				<span
					onClick={async () => {
						if (isBusy()) return

						if (!audioUrl()) return
						setTargetName(id())
						setAction("loading")
						console.log(
							"about to process",
							audioUrl(),
							"with video url",
							state.videoUrl
						)
						const processed =
							"https://s3." +
							S3_REGION +
							".amazonaws.com/" +
							(state.videoUrl
								? await processAudio(state.videoUrl, audioUrl())
								: audioUrl())
						setAction("playing")
						const audio = new Audio(processed)
						audio.oncanplay = () => audio.play()
						audio.onplay = () => setAction("playing")
						audio.onended = () => {
							setTargetName("")
							setAction("idle")
						}
						audio.load()
					}}
				>
					<span
						classList={{
							"text-red-500": is("playing"),
							"hover:text-blue-500 cursor-pointer":
								audioUrl() && !is("playing"),
							"opacity-20 cursor-not-allowed": !audioUrl() || isBusy(),
							hidden: !!props.cellData.url,
						}}
						title={audioUrl() ? "Play Audio" : "No Audio, Please record."}
					>
						<Show
							when={
								!props.cellData.url &&
								!props.cellData.input &&
								!props.cellData.content.startsWith("file:")
							}
						>
							<PlayIcon />
						</Show>
					</span>
				</span>
			</Show>
		</div>
	)
}
