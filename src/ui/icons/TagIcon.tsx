import { StaticIcon } from "./types"

export const TagIcon: StaticIcon = (props) => {
	return (
		<div>
			<svg
				width={props.size}
				height={props.size}
				viewBox="0 0 13 10"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M9.75333 0.893313C9.51333 0.553313 9.11333 0.333313 8.66667 0.333313L1.33333 0.33998C0.6 0.33998 0 0.933313 0 1.66665V8.33331C0 9.06665 0.6 9.65998 1.33333 9.65998L8.66667 9.66665C9.11333 9.66665 9.51333 9.44665 9.75333 9.10665L12.6667 4.99998L9.75333 0.893313Z"
					fill="#90CAF9"
				/>
			</svg>
		</div>
	)
}
