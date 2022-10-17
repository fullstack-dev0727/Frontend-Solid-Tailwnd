import { Component } from "solid-js"

type AppNotificationProps = {
	value: number
}

export const AppNotification: Component<AppNotificationProps> = (props) => {
	return (
		<div class="absolute w-[20px] h-[20px] right-[-1px] bottom-[-1px] flex bg-[#eeeeee] rounded-full">
			<div class="w-[16px] h-[16px] bg-[#EF5555] text-white text-center text-[11px] rounded-full leading-[1.5] m-auto">
				{props.value}
			</div>
		</div>
	)
}
