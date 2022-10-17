import {
	children as solidifyChildren,
	ComponentProps,
	createSignal,
	ParentProps,
	splitProps,
} from "solid-js"
import NewIconButton from "../IconButtons/new"
import SettingsIconButton from "../IconButtons/settings"
import { ShopifyIcon } from "../icons"

type ShopifyButtonProps<P = {}> = P & {
	name: string
	styled?: boolean
}

export const ShopifyButton = (
	props: ParentProps<ShopifyButtonProps<ComponentProps<"div">>>
) => {
	const [local, { name }] = splitProps(props, [
		"class",
		"styled",
		"children",
	])
	const [active, setActive] = createSignal(false)

	const onClick = () => {
		console.log(active())
		setActive(!active())
	}

	const activeClass = () => (active() ? "bg-black/[0.1]" : "")

	return (
		<div
			onclick={onClick}
			class={`group flex h-8 w-56 pr-[12px] pl-[12px] cursor-pointer justify-between rounded-[4px] px-1 transition-all duration-200 bg-black/0 hover:bg-black/[0.06] active: ${activeClass()}`}
		>
			<div class="flex items-center space-x-2">
				<div>
					<ShopifyIcon active={active} />
				</div>
				<span
					class={`text-[13px] font-[Inter] text-black/[0.6] font-medium ${
						active() ? "text-black/[0.9]" : ""
					} group-hover:text-black/[0.9]`}
				>
					{name}
				</span>
			</div>
			<div class="invisible flex items-center space-x-2 group-hover:visible group-active:visible">
				<SettingsIconButton />
				<NewIconButton />
			</div>
		</div>
	)
}
