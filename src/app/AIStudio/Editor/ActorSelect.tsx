import { user } from "@/api2"
import { actors, video_instances } from "@/api2/ai_studio"
import { DeleteIcon } from "@/assets/icons"
import { Component, createSignal } from "solid-js"
import { show } from "../ContextMenu"
import { state as appState } from "../state"

const [actorId, setActorId] = createSignal<string>("")

export { actorId }

export const ActorSelect: Component = () => {
	const [actorLabel, setActorLabel] = createSignal<string>("Select Actor")

	async function udpateActorLabel() {
		let {
			result: { actor_id },
		} = await video_instances.read({ id: appState.currentVideo })

		if (!actor_id) {
			console.log("creating a new actor")
			const {
				result: { first_name },
			} = await user.read()
			console.log("username", first_name)

			const { result: allActors } = await actors.list({})
			const existingActor = allActors.find((a) => a.name === first_name)

			if (existingActor) {
				actor_id = existingActor.id
			} else {
				const { result: a } = await actors.create({
					name: first_name,
				})
				actor_id = a.id
			}
			await video_instances.update({
				id: appState.currentVideo,
				actor_id,
			})
		}

		setActorId(actor_id)
		const { result: actor } = await actors.read({ id: actor_id })
		setActorLabel(actor.name)
	}

	udpateActorLabel()

	return (
		<div class="flex gap-1 items-center font-bold cursor-pointer">

			<div
				class="rounded-full bg-green-500 w-4 h-4 flex items-center justify-center text-white"
				onPointerDown={async () => {
					const name = prompt("Please enter an actor name")
					if (name) {
						await actors.create({
							name,
						})

						alert("Actor created")
					}
				}}
			>
				+
			</div>
			<span
				onPointerDown={async (e) => {
					const { result } = await actors.list({})
					show(
						e,
						result
							.filter((a) => a.id !== actorId())
							.map((a) => ({
								name: a.name,
								icon: (
									<div
										class="scale-75 mt-[-3px] hover:text-red-500"
										onPointerDown={(e) => {
											actors.delete({ id: a.id })
											e.preventDefault()
										}}
									>
										<DeleteIcon />
									</div>
								),
								action: async () => {
									await video_instances.update({
										id: appState.currentVideo,
										actor_id: a.id,
									})
									await udpateActorLabel()
								},
							}))
					)
				}}
			>
				{actorLabel()}
			</span>
		</div>
	)
}
