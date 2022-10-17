import { Component, For } from "solid-js"
import { state } from "./state"
import { Segment } from "./Transcription/Segment"

export const SegmentList: Component = () => {
	return (
		<div>
			<div class="flex flex-wrap gap-2 py-3 overflow-hidden">
				<For each={state.segments.filter((s) => !s.creating)}>
					{(segment) => (
						<div class="inline">
							<Segment
								flat
								{...segment}
							/>
						</div>
					)}
				</For>
			</div>
		</div>
	)
}
