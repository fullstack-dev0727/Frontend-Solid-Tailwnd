import { PlayIcon } from "@/assets/icons"
import { FrameIcon, WandIcon } from "@/ui/icons"
import { Spinner } from "@/ui/icons/Spinner"
import { Component, Match, Show, Switch } from "solid-js"
import { RecorderState } from "./Recorder"
import { transcriptionProgress } from "./state"

export const StartRecordingButton: Component<{ onClick: () => void }> = (
	props
) => {
	return (
		<div
			class="rounded-full border-black border-2 w-9 h-9 flex items-center justify-center group"
			{...props}
		>
			<div class="rounded-full w-7 h-7 bg-[#FF5757] group-hover:bg-red-700 duration-75"></div>
		</div>
	)
}

export const PauseRecordingButton: Component<{ onClick: () => void }> = (
	props
) => {
	return (
		<div
			class="rounded-full border-black border-2 w-9 h-9 flex items-center justify-center group"
			{...props}
		>
			<div class="rounded-sm w-4 h-4 bg-[#FF5757] group-hover:bg-red-700 duration-75"></div>
		</div>
	)
}

export const PlayButton: Component<{ active: boolean; onClick: () => void }> = (
	props
) => {
	return (
		<div
			onPointerUp={props.onClick}
			class="rounded-full border-[#4EADF1] bg-[#4EADF1] border-2 w-9 h-9 flex items-center justify-center hover:bg-[#3A9AE0] hover:border-[#3A9AE0] duration-75"
			classList={{
				"bg-[#3A9AE0] border-[#3A9AE0]": props.active,
			}}
		>
			<PlayIcon class="text-white" />
		</div>
	)
}

export const RecorderBar: Component<{
	onPlay: () => void
	onPause: () => void
	onCancel: () => void
	onSave: () => void
	onRecord: () => void
	disabled: boolean
	saveText: string
	saveLoading: boolean
	currentTime: string
	recorderState: RecorderState
}> = (props) => {
	return (
		<div class="p-3">
			<div class="flex justify-between items-center px-5">
				<button
					class="rounded-lg bg-[#4EADF1] py-2 px-2 font-[13px] font-semibold text-white font-[Inter] flex items-center gap-2 hover:bg-[#3A9AE0] duration-75"
					onClick={props.onCancel}
				>
					<FrameIcon size={14} />
					Cancel
				</button>
				<div class="flex items-center gap-2">
					<Switch>
						<Match
							when={
								props.recorderState === "idle" ||
								props.recorderState === "paused"
							}
						>
							<StartRecordingButton onClick={props.onRecord} />
						</Match>
						<Match when={props.recorderState === "recording"}>
							<PauseRecordingButton onClick={props.onPause} />
						</Match>
					</Switch>

					<div class="font-[Inter] font-semibold text-sm">
						{props.currentTime}
					</div>
				</div>
				<div class="flex rounded-lg overflow-hidden gap-[2px]">
					<button
						class="bg-[#4EADF1] py-2 px-3 font-[13px] font-semibold text-white font-[Inter] flex items-center gap-2 hover:bg-[#3A9AE0] duration-75"
						onClick={props.onSave}
						disabled={props.disabled || props.saveLoading}
						classList={{
							"opacity-50 cursor-not-allowed": props.disabled,
						}}
					>
						<Show
							when={props.saveLoading}
							fallback={<WandIcon size={12} />}
						>
							<Spinner height="h-6 mr-[-5px]" />
						</Show>
						{props.saveText}
						<Show when={props.saveText === "Transcribing"}>
							{" "}
							{transcriptionProgress().step}/{transcriptionProgress().total}
						</Show>
					</button>
				</div>
			</div>
		</div>
	)
}
