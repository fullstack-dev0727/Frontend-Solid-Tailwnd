import { Component } from "solid-js"

type MenuItemSearchProps = {
	name: string
	active: boolean
	onClick: () => void
	onClickSearch: () => void
}

export const MenuItemSearch: Component<MenuItemSearchProps> = (props) => {
	const NewIconButtonActive = () => {
		return (
			<div
				onClick={props.onClickSearch}
				class="w-[16px] h-[16px] flex"
			>
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M10.595 9.73908L13.8229 12.967C13.9363 13.0805 14.0001 13.2345 14 13.395C13.9999 13.5555 13.9361 13.7094 13.8226 13.8229C13.7091 13.9363 13.5551 14.0001 13.3946 14C13.2341 13.9999 13.0802 13.9361 12.9667 13.8226L9.73889 10.5947C8.77396 11.3421 7.56055 11.6938 6.34552 11.5783C5.13049 11.4627 4.00509 10.8887 3.19828 9.97284C2.39147 9.05701 1.96384 7.86821 2.0024 6.64827C2.04095 5.42834 2.54279 4.26891 3.40582 3.40586C4.26886 2.54281 5.42825 2.04095 6.64816 2.0024C7.86806 1.96384 9.05683 2.39148 9.97264 3.19831C10.8884 4.00514 11.4625 5.13056 11.578 6.34563C11.6935 7.56069 11.3418 8.77413 10.5944 9.73908H10.595ZM6.80022 10.3997C7.75496 10.3997 8.67059 10.0204 9.34569 9.34527C10.0208 8.67016 10.4001 7.7545 10.4001 6.79974C10.4001 5.84498 10.0208 4.92933 9.34569 4.25421C8.67059 3.5791 7.75496 3.19982 6.80022 3.19982C5.84549 3.19982 4.92986 3.5791 4.25476 4.25421C3.57966 4.92933 3.20039 5.84498 3.20039 6.79974C3.20039 7.7545 3.57966 8.67016 4.25476 9.34527C4.92986 10.0204 5.84549 10.3997 6.80022 10.3997Z"
						fill="black"
						fill-opacity="0.6"
					/>
				</svg>
			</div>
		)
	}

	return (
		<div
			onClick={props.onClick}
			class="group flex w-[224px] h-[20px] cursor-pointer px-[8px]"
		>
			<div class="w-full flex gap-2">
				<NewIconButtonActive />
				<p class="text-[13px] font-[Inter] font-semibold w-[184px] h-[16px] text-[13px] font-[Inter] font-semibold text-black/[0.6] group-hover:text-black/[0.9] leading-4">
					{props.name}
				</p>

				<div
					class="m-auto opacity-[0.6] group-hover:opacity-100"
					classList={{
						"opacity-100": props.active,
					}}
				></div>
			</div>
		</div>
	)
}
