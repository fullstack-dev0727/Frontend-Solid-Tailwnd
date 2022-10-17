import { StaticIcon } from "./types"

export const ChevronLeftIcon: StaticIcon = (props) => {
	return (
		<div>
			<svg
				width={props.size}
				height={props.size}
				viewBox="0 0 8 14"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M7 1L1 7L7 13"
					stroke="black"
					stroke-opacity="0.8"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</div>
	)
}
