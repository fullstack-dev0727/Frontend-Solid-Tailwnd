import { JSX, ParentComponent } from "solid-js"

type MenuItemProps = {
	name: string,
	active: boolean
	icon: JSX.Element
	class?: string
	onClick: () => void
	onClickPlus?: () => void
	onClickSettings?: () => void
}

export const MenuItem: ParentComponent<MenuItemProps> = (props) => {
	return (
		<div
			onClick={props.onClick}
			class={
				"group flex h-[28px] w-[224px] cursor-pointer rounded-[4px] px-[8px] py-[6px] bg-black/0 hover:bg-black/[0.06] " +
				props.class
			}
			classList={{
				"!bg-black/[0.1]": props.active,
			}}
		>
			<div class="contents items-center mr-[6px]">
				{props.icon}

				<span
					class="text-[13px] font-[Inter] text-black/[0.6] font-medium ml-[6px] mr-0 min-w-[134px] h-[16px] leading-[16px] overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-black/[0.9]"
					classList={{
						"text-black/[0.9]": props.active,
					}}
				>
					{props.name}
				</span>
			</div>
			<div
				class="flex items-center mr-0 ml-auto group-hover:flex gap-2"
				classList={{
					hidden: !props.active,
				}}
			>
				{props.children}
			</div>
		</div>
	)
}
