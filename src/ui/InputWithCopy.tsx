import {
	ComponentProps,
	createSignal,
	splitProps,
	ParentProps,
	onMount,
	onCleanup,
	Show,
} from "solid-js"
import { InsertBeforeApp } from "@/ui/core/InsertBefore"
import { LoadingIcon } from "@/assets/icons"
import { DoneIcon } from "@/assets/icons/done"

export const InputWithCopy = (props: ParentProps<ComponentProps<"input">>) => {
	const [copied, setCopied] = createSignal(false)

	const handleCopy = () => {
		const copyText = props.value
		if (copyText && typeof copyText === "string") {
			navigator.clipboard.writeText(copyText).then(() => {
				setCopied(true)
				setTimeout(() => {
					setCopied(false)
				}, 2000)
			})
		}
	}
	return (
		<div class="flex h-10  w-full max-w-md">
			<input
				type="text"
				readonly
				{...props}
				class={`bg-gray-200 rounded-l-xl rounded-r-none w-full h-full pl-3 pr-12 ${props.class}`}
			/>
			<button
				class="bg-blue-400 hover:bg-blue-500 cursor-pointer px-2 py-1 w-14 h-full rounded-r-xl text-sm font-bold text-white flex justify-center items-center"
				disabled={copied()}
				onclick={handleCopy}
			>
				<Show
					when={!copied()}
					fallback={<DoneIcon class="animate-pop-out" />}
				>
					Copy
				</Show>
			</button>
		</div>
	)
}
