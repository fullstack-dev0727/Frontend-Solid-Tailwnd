import { Component, ComponentProps, Show } from "solid-js"
import { AppIndicatorBar } from "./AppIndicatorBar"
import { AppNotification } from "./AppNotification"

import "./AppCircle.css"
import { AppLogo } from "./AppLogo"

type AppCircleProps = {
	active: boolean
	theme: string
	icon: string
	notifications: number
	onClick: () => void
	class?: string
	isNewUser?: boolean
} & ComponentProps<"div">

export const AppCircle: Component<AppCircleProps> = (props) => {
	const text = () => props.icon.length === 1

	return (
		<div class={`hover: group flex pt-[8px]`}>
			<AppIndicatorBar active={props.active} />
			<div
				onClick={props.onClick}
				class={
					`flex w-11 h-11 rounded-[32px] ml-0 cursor-pointer relative justify-between px-1 transition-all duration-200 hover:rounded-[12px]  ${props.isNewUser ? "cursor-not-allowed opacity-50 " : ""}` +
					props.class
				}
				classList={{
					"rounded-[12px]": props.active,
					// "grey-not-hover": !text() && !props.active,
				}}
				style={{ background: props.theme }}
			>
				<AppLogo
					active={props.active}
					icon={props.icon}
				/>

				<Show when={props.notifications > 0}>
					<AppNotification value={props.notifications} />
				</Show>
			</div>
		</div>
	)
}
