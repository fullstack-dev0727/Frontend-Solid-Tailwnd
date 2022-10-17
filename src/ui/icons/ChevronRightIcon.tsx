import { StaticIcon } from "./types"

export const ChevronRightIcon: StaticIcon = (props) => {
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
					d="M1 13L7 7L1 1"
					stroke="black"
					stroke-opacity="1"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</div>
	)
}
