import { MenuItem } from "@/ui/AppMenu"
import { Component, createSignal, For, JSXElement, Show } from "solid-js"

export type ContextMenuItem = {
	name: string
	icon: JSXElement
	action: () => void
}

export type ContextMenuOption = {
	position: { x: number; y: number }
	items: ContextMenuItem[]
}

export const [option, setOption] = createSignal<ContextMenuOption>(null)

export function show(event: MouseEvent, items: ContextMenuItem[]) {
	event.preventDefault()
	setOption({
		position: { x: event.clientX, y: event.clientY },
		items,
	})
}

export function hide() {
	setOption(null)
}

globalThis.addEventListener("pointerdown", (e) => {
	if (option())
		setTimeout(() => {
			hide()
		}, 1000)
})

export const ContextMenuProvider: Component = () => {
	return (
		<Show when={option()}>
			<div
				id="ctxmenu"
				class="fixed bg-white/[.95] p-1 shadow rounded-md"
				style={{
					left: option().position.x + "px",
					top: option().position.y + "px",
					"z-index": Number.MAX_SAFE_INTEGER,
				}}
			>
				<For each={option().items}>
					{(item) => (
						<MenuItem
							name={item.name}
							icon={item.icon}
							active={false}
							onClick={() => {
								hide()
								item.action()
							}}
						/>
					)}
				</For>
			</div>
		</Show>
	)
}
