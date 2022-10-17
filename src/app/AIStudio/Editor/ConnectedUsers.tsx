import { user } from "@/api2"
import { Component, createEffect, createSignal, For, Show } from "solid-js"
import { userRepo, userRepoUpdate } from "./Spreadsheet"

export const Avatar: Component<{
	image: string
	active?: boolean
	title: string
}> = (props) => {
	return (
		<div
			class="flex items-center relative"
			title={props.title}
		>
			<img
				src={props.image}
				class="object-cover w-10 rounded-full shadow"
			/>
			<Show when={props.active}>
				<div class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow" />
			</Show>
		</div>
	)
}

const env =
	import.meta.env.MODE == "stage"
		? ".stage"
		: import.meta.env.MODE == "dev"
		? ".dev"
		: ""

const ws = new WebSocket(
	`wss://presence-ws${env}.bhuman.ai/ws/presence/` +localStorage.getItem("access_token")
	// `wss://test.bhuman.ai/ws/presence/` + 
)

const [users, setUsers] = createSignal([])

ws.onopen = () => {
	console.log("Connected to server")
}

ws.onmessage = (e) => {
	const data = JSON.parse(e.data)
	console.log("presence", data)
	setUsers(data)
}

export const ConnectedUsers: Component = () => {
	const [users, setUsers] = createSignal<
		{ name: string; pfp: string; id: string }[]
	>([])

	const [name, setName] = createSignal("You")
	const [pfp, setPfp] = createSignal("")

	async function main() {
		const {
			result: { first_name, picture },
		} = await user.read()
		setName(first_name + " (You)")
		setPfp(picture)
	}

	main()

	createEffect(() => {
		void userRepoUpdate()
		setUsers(
			[...userRepo.values()].map((u) => ({
				name: u.name,
				pfp: u.pfp,
				id: u.user_id,
			}))
		)
	})

	const uniqueUsers = () =>
		users()
			.filter((v) => v.id !== localStorage.getItem("user_id"))
			.reduce(
				(known, u) =>
					known.find((v) => v.id === u.id) ? known : known.concat(u),
				[]
			)

	return (
		<div class="flex gap-2">
			<Avatar
				title={name()}
				active
				image={
					pfp() || `https://robohash.org/${localStorage.getItem("user_id")}`
				}
			/>
			<For each={uniqueUsers()}>
				{(u) => {
					return (
						<Avatar
							title={u.name}
							active
							image={
								u.pfp || `https://robohash.org/${localStorage.getItem(u.id)}`
							}
						/>
					)
				}}
			</For>
		</div>
	)
}
