import { StaticIcon } from "./types"

export const FrameIcon: StaticIcon = (props) => {
	return (
		<div>
			<svg
				width={props.size}
				height={props.size}
				viewBox="0 0 14 12"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M2 10H12V2H2V10ZM4 4H10V8H4V4ZM1 4H0V0.5L0.5 0H4V1H1V4ZM14 0.5V4H13V1H10V0H13.5L14 0.5ZM13 8H14V11.5L13.5 12H10V11H13V8ZM1 11H4V12H0.5L0 11.5V8H1V11Z"
					fill="white"
				/>
			</svg>
		</div>
	)
}
