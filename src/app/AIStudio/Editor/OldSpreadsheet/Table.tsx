import { Component, createEffect, createResource, For } from "solid-js"
import { getAudioBatchData } from "../api"

import { state } from "../../state"
import { AudioBatchData } from "@/api.type"
import { TableCell } from "./TableCell"
import { TableHead } from "./TableHead"
import { initVideoInstance } from "../api/initVideoInstance"

const [data, { refetch }] = createResource<AudioBatchData>(async () => {
	if (!state.currentVideo) return []
	await initVideoInstance(state.currentVideo)
	return (await getAudioBatchData(state.currentVideo)).data
})

createEffect(() => {
	void state.currentVideo
	refetch()
})

export const Table: Component = () => {
	return (
		<div class="overflow-auto m-2 styled-scrollbar min-h-[20vh]">
			<table class="border-collapse border">
				<For each={data()}>
					{(row, i) => (
						<tr>
							<For each={row}>
								{(cell) => {
									const heading = i() === 0
									return heading ? (
										<TableHead
											name={cell.name}
											column={cell.column_id}
										/>
									) : (
										<TableCell name={cell.name} />
									)
								}}
							</For>
						</tr>
					)}
				</For>
			</table>
		</div>
	)
}
