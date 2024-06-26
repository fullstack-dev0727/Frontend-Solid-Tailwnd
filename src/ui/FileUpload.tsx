import { Button } from "@/ui/Buttons"
import { Accessor, createSignal, onMount, PropsWithChildren } from "solid-js"

type UploadButtonProps<P = {}> = P & {
	accept: "video/*" | "audio/*" | ".csv"
	stylied?: boolean
	handleFile: (arg0: Blob) => void
	class: string
	disabled: boolean
}

type UploadRegionProps<P = {}> = P & {
	handleFile: (arg0: Blob) => void
	class: string
	classList: (arg0: Accessor<boolean>) => {
		[k: string]: boolean
	}
}

export const FileUpload = {
	Region: (props: PropsWithChildren<UploadRegionProps>) => {
		const [isActive, setActiveState] = createSignal<boolean>(true)
		onMount(() => setActiveState(false))

		return (
			<div
				classList={props.classList(isActive)}
				onDragOver={(e) => {
					e.preventDefault()
					setActiveState(true)
				}}
				onDragEnter={(e) => {
					e.preventDefault()
					setActiveState(true)
				}}
				onDragLeave={(e) => {
					e.preventDefault()
					setActiveState(false)
				}}
				onDrop={(e) => {
					e.preventDefault()
					setActiveState(false)
					const VideoUploaded = e.dataTransfer.files[0]
					props.handleFile(VideoUploaded)
				}}
				class={props.class}
			>
				{props.children}
			</div>
		)
	},
	Btn: (props: PropsWithChildren<UploadButtonProps>) => {
		let hiddenFileInput: HTMLInputElement
		return (
			<>
				<Button
					stylied={props?.stylied}
					onClick={() => hiddenFileInput.click()}
					class={props.class}
					disabled={props?.disabled}
				>
					{props.children}
				</Button>
				<input
					ref={(el) => (hiddenFileInput = el)}
					type="file"
					onChange={(e) => {
						const VideoUploaded = e.currentTarget.files[0]
						props.handleFile(VideoUploaded)
					}}
					accept={props.accept}
					class="hidden"
				/>
			</>
		)
	},
}
