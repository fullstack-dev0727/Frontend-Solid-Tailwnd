import { Component, createSignal } from "solid-js"

export type RenamableProps = {
	name: string
	onRename?: (name: string) => void
	onInit?: (setRenaming: (renaming: boolean) => void) => void
}

export const Renamable: Component<RenamableProps> = (props) => {
	let ref!: HTMLDivElement
	const [renaming, setRenaming] = createSignal(false)
	props.onInit?.(setRenaming)

	function done() {
		setRenaming(false)
		props.onRename(ref.innerText)
		ref.innerText = props.name
	}

	return (
		<div
			ref={ref}
			class="bg-transparent font-[Inter] outline-transparent w-full"
			contentEditable={props.onRename && renaming()}
			onChange={done}
			onFocusOut={done}
			onKeyDown={(e) => e.key === "Enter" && done()}
			classList={{
				"cursor-pointer select-none": !renaming(),
			}}
			onDblClick={() => {
				if (!props.onRename) return
				setRenaming(true)
				ref.focus()
				const range = document.createRange()
				range.selectNodeContents(ref)
				const selection = window.getSelection()
				selection.removeAllRanges()
				selection.addRange(range)
			}}
		>
			{props.name}
		</div>
	)
}
