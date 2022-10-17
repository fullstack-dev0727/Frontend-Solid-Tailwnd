import { CheckIcon, ChevronLeftIcon } from "@/assets/icons"
import { EditIcon } from "@/ui/icons"
import { Component, createSignal, For, Show } from "solid-js"
import {
	loadSegments,
	loadTranscriptionTokens,
	setTranscriptionTokens,
	state,
} from "../state"
import { Tooltip } from "./Tooltip"
import { handleSelection } from "./handleSelection"

export const Transcription: Component<{
	time: number
}> = (props) => {
	let container!: HTMLDivElement
	let editContainer!: HTMLDivElement

	loadSegments()

	loadTranscriptionTokens()

	const [editing, setEditing] = createSignal(false)

	return (
		<div
			ref={container}
			class="font-[Inter] h-full"
		>
			<Show
				when={editing()}
				fallback={
					<>
						<div
							onPointerUp={handleSelection}
							class="mb-2"
						>
							<For each={state.tokens}>
								{(token, i) => {
									const center = (token.from + token.to) / 2
									const segment = () =>
										state.segments.find((r) => center > r.from && center < r.to)
									const previous = () => state.tokens[i() - 1]
									const next = () => state.tokens[i() + 1]
									return (
										<div
											data-i={i()}
											class="overflow-visible relative items-center inline-flex border-x-4 border-transparent"
											classList={{
												"bg-blue-100 group select-none hover:bg-blue-300":
													!!segment(),
												"border-l-blue-500":
													props.time > previous()?.to &&
													props.time < token.from,
												"border-r-blue-500": !next() && props.time > token.to,
											}}
										>
											<span
												class="rounded box-border leading-8"
												classList={{
													"bg-blue-400 text-white animate-pulse":
														props.time >= token.from && props.time < token.to,
												}}
											>
												{token.value}
											</span>
											<Show when={segment()}>
												<Tooltip
													{...segment()}
													container={container}
												/>
											</Show>
										</div>
									)
								}}
							</For>
						</div>
						<button
							class="cursor-pointer rounded bg-gray-200 p-1 text-xs font-semibold text-gray-500 font-[Inter] flex items-center gap-1 hover:bg-gray-300 duration-75"
							onClick={() => setEditing(true)}
						>
							<EditIcon size={12} />
							Edit Transcription
						</button>
					</>
				}
			>
				<div
					ref={editContainer}
					class="outline-none leading-8 mb-2"
					contentEditable
				>
					{state.tokens.map((t) => t.value).join(" ")}
				</div>
				<div class="flex gap-2">
					<button
						class="pr-2 cursor-pointer rounded bg-gray-200 p-1 text-xs font-semibold text-gray-500 font-[Inter] flex items-center gap-1 hover:bg-gray-300 duration-75"
						onClick={() => setEditing(false)}
					>
						<ChevronLeftIcon class="h-4" />
						Cancel
					</button>
					<button
						class="pr-2 cursor-pointer rounded bg-green-500 p-1 text-xs font-semibold text-white font-[Inter] flex items-center gap-1 hover:bg-green-600 duration-75"
						onClick={async () => {
							const words = editContainer.textContent.replace(/\W/g, " ")
							await setTranscriptionTokens(words)
							setEditing(false)
						}}
					>
						<CheckIcon class="h-4" />
						Realign Transcription
					</button>
				</div>
			</Show>
		</div>
	)
}
