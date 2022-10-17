import { For, ParentComponent, Show } from "solid-js"
import { move } from "./move"
import { Panel } from "./Panel"
import { snap } from "./snap"
import { ProviderGetSet } from "./types"
import { cursor } from "./utils"
import "./index.css"

export const Provider: ParentComponent<ProviderGetSet> = (props) => {
	let container!: HTMLDivElement
	return (
		<div
			ref={container}
			style={{
				position: "relative",
				width: "100%",
				height: "100%",
				overflow: "hidden",
				cursor: props.get.left0 ? "move" : cursor(props.get.x, props.get.y),
			}}
			onPointerMove={(e) => {
				if (props.get.x) props.set("panels", 0, "rect", props.get.x, e.x)
				if (props.get.y) props.set("panels", 0, "rect", props.get.y, e.y)
				move(props, e.x, e.y, container.clientWidth, container.clientHeight)
			}}
			onPointerUp={() => {
				props.set("x", undefined)
				props.set("y", undefined)
				props.set("x0", undefined)
				props.set("y0", undefined)
				props.set("left0", undefined)
				props.set("top0", undefined)
				if (props.get.snap) {
					props.set("right0", undefined)
					props.set("bottom0", undefined)
					snap(props, container.clientWidth, container.clientHeight)
				}
			}}
		>
			{props.children}
			<Show when={props.get.snap}>
				<div
					classList={{
						"sp-frame": true,
						"sp-frame-n": props.get.frameY === "top",
						"sp-frame-s": props.get.frameY === "bottom",
						"sp-frame-w": props.get.frameX === "left",
						"sp-frame-e": props.get.frameX === "right",
					}}
				/>
			</Show>

			<Show when={!(props.get.panels[0].mode === "collapsed" && (props.get.panels[0].id === "editorTutorial" || props.get.panels[0].id === "studioTutorial"))}>
				<For each={[...props.get.panels].reverse()}>
					{(panel) => (
						<Panel
							{...props}
							{...panel}
						/>
					)}
				</For>
			</Show>
		</div>
	)
}
