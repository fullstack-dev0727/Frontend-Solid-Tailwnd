import { StaticIcon } from "./types"

export const DropdownIcon: StaticIcon = (props) => {
	return (
		<svg
			width={props.size}
			height={props.size}
			viewBox="0 0 10 5"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M1 0.5L5 4.5L9 0.5"
				stroke="black"
				stroke-width="1.1"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	)
}
