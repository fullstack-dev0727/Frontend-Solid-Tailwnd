import { PauseIcon, PlayIcon } from "@/assets/icons"
import { FrameIcon } from "@/ui/icons"
import { Component, Show } from "solid-js"
import { GenerateButton } from "./GenerateButton"

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
			<Show
				when={props.active}
				fallback={<PlayIcon class="text-white" />}
			>
				<PauseIcon class="text-white" />
			</Show>
		</div>
	)
}

export const PlayerBar: Component<{
	onPlay: () => void
	onRecord: () => void
	currentTime: string
	playActive: boolean
}> = (props) => {
	return (
		<div class="mt-3 py-1 sticky top-[-1px] bg-white/[0.9] z-50">
			<div class="flex justify-between items-center px-5 gap-3">
				<button
					class="rounded-lg bg-[#4EADF1] py-2 px-2 font-[13px] font-semibold text-white font-[Inter] flex items-center gap-2 hover:bg-[#3A9AE0] duration-75"
					onClick={props.onRecord}
				>
					<FrameIcon size={14} />
					Record
				</button>
				<div class="flex items-center gap-2">
					{/* <ChevronLeftIcon size={12} /> */}
					<PlayButton
						active={props.playActive}
						onClick={props.onPlay}
					/>

					<div class="font-[Inter] font-semibold text-sm">
						{props.currentTime}
					</div>
					{/* <ChevronRightIcon size={12} /> */}
				</div>
				<GenerateButton />
			</div>
		</div>
	)
}
