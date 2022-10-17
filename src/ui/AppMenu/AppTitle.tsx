import { JSXElement, ParentComponent } from "solid-js"
import { AppTitleIcon } from "."

type AppTitleProps = {
	icon: string | JSXElement
	active: boolean
	theme: string
	name: string
	onClick: () => void
}

export const AppTitle: ParentComponent<AppTitleProps> = (props) => {
	return (
		<div
			onclick={props.onClick}
			class="flex h-12 cursor-pointer p-[12px] bg-black/0 hover:bg-black/[0.06] justify-between"
			classList={{
				"bg-black/[0.1]": props.active,
			}}
		>
			<div class="flex items-center gap-1">
			{typeof props.icon === "string" ? <AppTitleIcon
				icon={props.icon}
				theme={props.theme}
			/> : props.icon}
			<div class="text-[15px] font-[Inter] font-semibold my-auto leading-[18px] overflow-hidden text-ellipsis whitespace-nowrap">
				{props.name}
			</div>
			</div>
			<div class="ml-auto flex justify-center items-center">{props.children}</div>
		</div>
	)
}
