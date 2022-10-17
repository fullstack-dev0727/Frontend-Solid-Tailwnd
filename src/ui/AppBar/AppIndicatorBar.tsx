import { Component } from "solid-js"


type AppIndicatorBarProps = {
	active: boolean
}

export const AppIndicatorBar: Component<AppIndicatorBarProps> = (props) => {
	return (
		<div
			class="w-[4px] bg-black m-auto rounded-r-full ml-0 mr-[6px] group-hover:h-[16px]"
			classList={{
				"!h-[32px]": props.active,
				"h-0": !props.active,
			}}
		></div>
	)
}
