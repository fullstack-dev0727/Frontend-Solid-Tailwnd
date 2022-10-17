import { Accessor, ComponentProps, Setter, Show, splitProps } from "solid-js"

type FolderProps<P = {}> = P & {
	name: string
	count: number
	index: number
	active: boolean
	styled?: boolean
	onClick: () => void
}

export const TabItem = (props: FolderProps<ComponentProps<"div">>) => {
	const [local, others] = splitProps(props, [
		"children",
		"count",
		"active",
		"name",
		"onClick",
	])
	/* Just Background and Text Colors */
	// const visuals = `bg-white group-hover:bg-slate-200 group-active:bg-slate-300 transition-colors`

	const eventClick = () => {
		props.onClick(props.index)
	}
	return (
		/* 6px Padding */
		<div
			onclick={eventClick}
			class="group flex gap-1 cursor-pointer"
		>
			<div
				class={`text-[15px] reading-[18px] font-[Inter] font-semibold group-hover:text-black/[0.9] ${
					props.active ? "text-black/[0.9]" : "text-black/[0.6]"
				}`}
			>
				{local.name}
			</div>
			<div class="text-[15px] reading-[18px] font-[Inter] font-normal text-black/[0.6]">
				{local.count}
			</div>
		</div>
	)
}
