import { ComponentProps } from "solid-js"

export const DoneIcon = (props: ComponentProps<"svg">) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={24}
			height={24}
			fill="none"
			stroke="currentColor"
			stroke-width={2}
			stroke-linecap="round"
			stroke-linejoin="round"
			{...props}
		>
			<path d="M20 6 9 17l-5-5" />
		</svg>
	)
}
