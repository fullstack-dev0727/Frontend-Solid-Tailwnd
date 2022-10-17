import { ParentComponent } from "solid-js"

type FileIconProps = {
	onClick: () => void
}

export const FileIcon: ParentComponent<FileIconProps> = (props) => {
	const FileActive = () => {
		return (
			<div class="w-[56px] h-[56px] flex">
				<svg
					class="n-auto"
					width="56"
					height="56"
					viewBox="0 0 56 56"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M46.6667 44.5C46.6667 48.9183 43.0849 52.5 38.6667 52.5H17.3333C12.9151 52.5 9.33334 48.9183 9.33334 44.5V11.5C9.33334 7.08172 12.9151 3.5 17.3333 3.5H31.6863C33.808 3.5 35.8429 4.34285 37.3431 5.84315L44.3235 12.8235C45.8238 14.3238 46.6667 16.3586 46.6667 18.4804V44.5Z"
						fill="#90CAF9"
					/>
					<path
						d="M41.5025 12.9191C42.7624 14.179 41.87 16.3333 40.0882 16.3333H35.8333C34.7288 16.3333 33.8333 15.4379 33.8333 14.3333V10.0784C33.8333 8.29662 35.9876 7.40428 37.2475 8.66421L41.5025 12.9191Z"
						fill="#E1F5FE"
					/>
					<path
						d="M32.1417 34.3817C33.4364 33.6049 33.4364 31.7286 32.1417 30.9518L26.3623 27.4841C25.0293 26.6843 23.3333 27.6445 23.3333 29.1991V36.1344C23.3333 37.689 25.0293 38.6492 26.3623 37.8494L32.1417 34.3817Z"
						fill="#1976D2"
					/>
				</svg>
			</div>
		)
	}

	return (
		<div
			onclick={props.onClick}
			class={`group flex h-[64px] w-[64px] cursor-pointer justify-between transition-all duration-200 hover:bg-black/[0.06] rounded-[12px]`}
		>
			<div class={`m-auto`}>
				<FileActive />
			</div>
		</div>
	)
}
