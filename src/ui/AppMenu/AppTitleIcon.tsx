import { Component } from "solid-js"
import { AppLogo } from "../AppBar/AppLogo"

type AppTitleIconProps = {
	icon: string
	theme: string
}

export const AppTitleIcon: Component<AppTitleIconProps> = (props) => {
	const text = () => props.icon.length === 1
	return (
		<div>
			<div
				style={text() ? { background: props.theme } : {}}
				class="flex align-middle h-[24px]"
				classList={{
					"w-[24px] m-auto text-center leading-[1.4] text-[15px] font-[Inter] font-semibold text-white rounded-[4px]":
						text(),
				}}
			>
				<AppLogo
					icon={props.icon}
					active={false}
				></AppLogo>
			</div>
		</div>
	)
}
