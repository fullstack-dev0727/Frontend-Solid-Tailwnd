import { createSignal, Show } from "solid-js"
import { Player } from "./Player"
import { Recorder } from "./Recorder"
import { loadVideoFromInstance } from "./state"

export const EditorRight = () => {
	const [usingRecorder, setUsingRecorder] = createSignal(false)
	loadVideoFromInstance()
	return (
		<div
			class="justify-center overflow-y-scroll styled-scrollbar"
			style={{
				height: "calc(100vh - 180px)",
			}}
		>
			<Show
				when={usingRecorder()}
				fallback={
					<Player
						onRecord={() => setUsingRecorder(true)}
						width={1080}
						height={720}
					/>
				}
			>
				<Recorder
					onCancel={() => setUsingRecorder(false)}
					width={1080}
					height={720}
				/>
				<div class="pl-7 pt-2 text-sm text-red-600">
					*Please make sure your face is clearly visible.
				</div>
			</Show>
		</div>
	)
}
