import { Button } from "@/app/Home/Feed/Post"
import { Match, Switch } from "solid-js"

export const Label = (props: {
	text?: string
	onClick?: () => void
	segment?: { startTime?: string; endTime?: string }
}) => {
	return (
		<div
			class={`flex items-center rounded-[16px] shadow-[0px_5px_48px_rgba(0,0,0,0.12)] w-[412px] h-[52px] pl-[24px] pr-[8px] bg-white`}
		>
			<input
				placeholder="Label your variable"
				class={`outline-none rounded-[12px] p-[4px] font-[500] text-[15px] text-[#86868B] w-[178px] flex-shrink-1 grow`}
			/>
			<div class="flex flex-row items-center gap-[4px] p-[2px] bg-[#BFF9B5] text-[#1E5814] text-[13px] h-[16px] font-[500]">
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g clip-path="url(#clip0_11068_17694)">
						<path
							d="M7.99967 14.6666C11.6816 14.6666 14.6663 11.6818 14.6663 7.99992C14.6663 4.31802 11.6816 1.33325 7.99967 1.33325C4.31778 1.33325 1.33301 4.31802 1.33301 7.99992C1.33301 11.6818 4.31778 14.6666 7.99967 14.6666Z"
							stroke="#1E5814"
							stroke-width="1.4"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M10 10.6667L8.39067 9.05733C8.1406 8.80734 8.00008 8.46826 8 8.11467V4"
							stroke="#1E5814"
							stroke-width="1.4"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</g>
					<defs>
						<clipPath id="clip0_11068_17694">
							<rect
								width="16"
								height="16"
								fill="white"
							/>
						</clipPath>
					</defs>
				</svg>
				<div>{props.segment?.startTime}</div>-
				<div>{props.segment?.endTime}</div>
			</div>
			<div class="flex-shrink-0 pl-[10px]">
				<Switch>
					<Match when={props.text === undefined}>
						<Button
							color="#187FE7"
							height="36"
							width="82"
							text="Create"
							onClick={() => props.onClick}
						></Button>
					</Match>
					<Match when={props.text != ""}>
						<button
							class="bg-[#E91E1E1F] text-[#F40A0A] w-[82px] h-[36px] rounded-[24px] font-[500] text-[15px]"
							onClick={props.onClick}
						>
							Delete
						</button>
					</Match>
				</Switch>
			</div>
		</div>
	)
}
