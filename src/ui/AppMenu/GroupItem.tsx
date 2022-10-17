import { Component, Show } from "solid-js"

type GroupItemProps = {
	name: string
	active: boolean
	src?: string
	onClick: () => void
}

export const GroupItem: Component<GroupItemProps> = (props) => {
	return (
		<div
			onClick={props.onClick}
			class={`group w-full max-h-[70px] px-[8px] py-[6px] mt-[4px] cursor-pointer hover:bg-black/[0.06] rounded-md`}
			classList={{
				"!bg-black/[0.1]": props.active,
			}}
		>
			<div class="flex items-center content-center justify-center w-full gap-2">
				<Show
					when={props.src}
					fallback={
						<p class="w-[30px] h-[30px] text-[18px] flex items-center content-center justify-center rounded-lg font-semibold text-white text-center align-middle bg-black/[0.8]">
							{props.name[0]}
						</p>
					}
				>
					<img
						src={props.src}
						class={`w-[30px] h-[30px] rounded-lg object-contain`}
					/>
				</Show>
				<p class="text-[14px] font-medium font-[Inter] text-[#1D1DF60]/[0.6] w-full group-hover:text-black/[0.9] overflow-hidden text-ellipsis whitespace-nowrap">
					{props.name}
				</p>
			</div>
		</div>
	)
}
