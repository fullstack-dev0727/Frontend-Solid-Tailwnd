import { Component, Show } from "solid-js"

type AppLogoProps = {
	icon: string
	active: boolean
}

export const AppLogo: Component<AppLogoProps> = (props) => {
	const text = () => props.icon.length === 1

	return (
		<Show
			when={text()}
			fallback={
				<div
					// class={`m-auto ${
					// 	!location.pathname.includes("settings") ? "group-hover:invert" : ""
					// } ${
					// 	props.active && !location.pathname.includes("settings")
					// 		? "invert"
					// 		: ""
					// }`}
					// class={`m-auto group-hover:invert ${props.active ? "invert" : ""}`}
					class={`m-auto`}
				>
					<img src={props.icon} />
				</div>
			}
		>
			<div
				class={`w-[20px] h-[20px] m-auto text-center text-[15px] font-[Inter] font-semibold text-white`}
			>
				{props.icon.toUpperCase()}
			</div>
		</Show>
	)
}
