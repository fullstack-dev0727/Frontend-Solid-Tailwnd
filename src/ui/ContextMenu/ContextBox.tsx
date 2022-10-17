import { batch, createSignal, JSXElement, onCleanup } from "solid-js"
import { ContextMenu } from "."

export interface ContextBoxSub {
	onHide?: () => void
	element: (hideSub: () => void) => JSXElement
}

export type ContextBoxChildrenProducer = (
	setConextMenu: (active: boolean, ev?: MouseEvent) => void,
	isOpen: boolean
) => JSXElement

export type ItemSpec = {
	name: string
	icon?: JSXElement
	sub?: ContextBoxSub
	onClick?: () => void
}

// parent must have relative positioning
export const ContextBox = (props: {
	contextMenuProps?: Partial<Parameters<typeof ContextMenu>[0]>
	items: ItemSpec[]
	children: ContextBoxChildrenProducer
}) => {
	const [isActiveSub, setActiveSub] = createSignal<ContextBoxSub>()
	const [isActiveMain, setActiveMain] = createSignal<boolean>(false)
	const [pos, setPos] = createSignal<{ x: number; y: number }>()

	let boxRef: HTMLDivElement

	const hideActiveSub = () => {
		isActiveSub()?.onHide?.()
		setActiveSub(undefined)
	}

	const controller = new AbortController()

	const onBlur = (ev: MouseEvent) => {
		if (
			!(ev.target as HTMLElement).closest(".context-menu") &&
			!boxRef.contains(ev.target as HTMLElement) &&
			(isActiveSub() || isActiveMain())
		) {
			batch(() => {
				setPos()
				setActiveMain(false)
				hideActiveSub()
			})
			ev.preventDefault()
		}
	}

	window.addEventListener("click", onBlur, {
		signal: controller.signal,
		capture: true,
	})
	window.addEventListener("contextmenu", onBlur, {
		signal: controller.signal,
		capture: true,
	})

	onCleanup(() => controller.abort())

	const getLeft = () => {
		if (pos()) return `${pos().x}px`
		return props.contextMenuProps?.left
	}

	const getRight = () => {
		if (pos()) return `${pos().y}px`
		return props.contextMenuProps?.top
	}

	return (
		<div
			class="relative"
			ref={boxRef}
			onMouseDown={(e) => {
				if (isActiveMain() || isActiveSub()) e.stopPropagation()
			}}
		>
			{props.children((active, mouseEvent) => {
				if (isActiveSub()) return
				batch(() => {
					setActiveMain(active)
					if (mouseEvent) {
						const rectPos = (
							mouseEvent.currentTarget as HTMLElement
						).getBoundingClientRect()
						setPos({
							x: mouseEvent.clientX - rectPos.x,
							y: mouseEvent.clientY - rectPos.y,
						})
					}
				})
			}, isActiveMain())}
			{isActiveMain() && (
				<ContextMenu
					items={props.items.map((i) => ({
						...i,
						onClick: () => {
							batch(() => {
								setPos()
								setActiveMain(false)
								if (i.sub) setActiveSub(i.sub)
								i.onClick?.()
							})
						},
					}))}
					{...props.contextMenuProps}
					top={getRight()}
					left={getLeft()}
				/>
			)}
			{isActiveSub() && (
				<div
					class="absolute z-[10000]"
					onBlur={hideActiveSub}
					onKeyUp={(el) => {
						if (el.key === "Enter") hideActiveSub()
					}}
				>
					{isActiveSub().element(hideActiveSub)}
				</div>
			)}
		</div>
	)
}
