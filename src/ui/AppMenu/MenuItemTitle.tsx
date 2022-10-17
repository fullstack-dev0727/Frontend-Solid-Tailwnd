import { Component } from "solid-js"

type MenuItemTitleProps = {
	name: string
	active: boolean
	onClick: () => void
	onClickPlus?: () => void
}

export const MenuItemTitle: Component<MenuItemTitleProps> = (props) => {
	const NewIconButtonActive = () => {
		return (
			<div
				onClick={props.onClickPlus}
				class="w-[16px] h-[16px] flex"
			>
				<svg
					class="m-auto"
					width="12"
					height="12"
					viewBox="0 0 12 12"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M5.99962 0C6.41081 0 6.74414 0.333335 6.74414 0.744526L6.74414 11.2555C6.74414 11.6667 6.41081 12 5.99962 12C5.58843 12 5.25509 11.6667 5.25509 11.2555L5.25509 0.744526C5.25509 0.333335 5.58843 0 5.99962 0Z"
						fill="black"
						fill-opacity="0.9"
					/>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M0 6.00014C0 5.58895 0.333335 5.25562 0.744526 5.25562H11.2555C11.6667 5.25562 12 5.58895 12 6.00014C12 6.41133 11.6667 6.74467 11.2555 6.74467H0.744526C0.333335 6.74467 0 6.41133 0 6.00014Z"
						fill="black"
						fill-opacity="0.9"
					/>
				</svg>
			</div>
		)
	}

	return (
		<div
			onClick={props.onClick}
			class={`group flex w-[224px] h-[20px] px-[8px] ${
				props?.onClickPlus ? "cursor-pointer" : ""
			}`}
		>
			<div class="w-full flex gap-2">
				<p class="text-[13px] font-[Inter] font-semibold w-[184px] h-[16px] text-[13px] font-[Inter] font-semibold text-black/[0.6] group-hover:text-black/[0.9] leading-4">
					{props.name}
				</p>
				{props?.onClickPlus ? (
					<div
						class={`m-auto opacity-[0.6] group-hover:opacity-100 ${
							!props?.onClickPlus ? "display-none" : ""
						}`}
						classList={{
							"opacity-100": props.active,
						}}
					>
						<NewIconButtonActive />
					</div>
				) : null}
			</div>
		</div>
	)
}
