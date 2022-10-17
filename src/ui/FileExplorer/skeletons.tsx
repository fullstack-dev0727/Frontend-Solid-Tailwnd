import { ChevronDownIcon, FileIcon, PlusIcon, XIcon } from "@/assets/icons"

import { ComponentProps, children, splitProps } from "solid-js"
import { ResizeAble } from "./utilResizeAble"

type FileProps<P = {}> = P & {
	onClose: (e: MouseEvent) => void
}

export const FileContainer = (props: ComponentProps<"li">) => {
	const [local, others] = splitProps(props, ["children", "ref"])
	return <li {...others}>{children(() => props.children)()}</li>
}

export const File = (props: FileProps<ComponentProps<"button">>) => {
	const [local, others] = splitProps(props, ["children", "ref", "onClose"])
	return (
		<>
			<ResizeAble>
				<button {...others}>
					<span class="basis-6 shrink flex items-center rounded-l-lg overflow-hidden w-0">
						<FileIcon class="w-5 h-5" />
					</span>
					{children(() => props.children)()}
				</button>
			</ResizeAble>
			<button
				id="delete-for-file-button"
				class="basis-6 shrink overflow-hidden w-0 group"
				onClick={props.onClose}
			>
				<XIcon
					class="w-5 h-5"
					basic={true}
				/>
			</button>
		</>
	)
}

type FolderProps<P = {}> = P & {
	onClose: () => void
	onAdd: () => void
}

export const Folder = (props: FolderProps<ComponentProps<"button">>) => {
	const [local, others] = splitProps(props, [
		"children",
		"ref",
		"onClose",
		"onAdd",
	])
	return (
		<div class="flex px-2 rounded-lg transition-colors">
			<ResizeAble>
				<button {...others}>
					<span class="basis-6 shrink flex items-center rounded-l-lg overflow-hidden w-0">
						<ChevronDownIcon class="w-5 h-5 text-slate-900" />
					</span>
					{children(() => props.children)()}
				</button>
			</ResizeAble>
			<button
				onClick={props.onAdd}
				class="basis-6 shrink overflow-hidden w-0 bg-white text-slate-900 group"
			>
				<PlusIcon />
			</button>
			<button
				id="delete-action-button-for-folder"
				class="basis-6 shrink overflow-hidden w-0 bg-white text-slate-900 rounded-r-lg group"
				onClick={props.onClose}
			>
				<XIcon basic={true} />
			</button>
		</div>
	)
}

export const Skeleton = {
	Folder,
	File,
}
