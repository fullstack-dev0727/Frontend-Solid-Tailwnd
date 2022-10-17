import { Component, Show } from "solid-js"
import { Handle } from "./Handle"
import { Header } from "./Header"
import { PanelData, ProviderGetSet } from "./types"

export const Panel: Component<PanelData & ProviderGetSet> = (props) => {
	const maximized = () => props.mode === "maximized"
	return (
		<div
			style={{
				left: maximized() ? 0 : props.rect.left + "px",
				top: maximized() ? 0 : props.rect.top + "px",
				bottom:
					props.mode === "collapsed"
						? ""
						: maximized()
							? 0
							: `calc(100% - ${props.rect.bottom}px)`,
				right: maximized() ? 0 : `calc(100% - ${props.rect.right}px)`,
				position: "fixed",
				display: "grid",
				"grid-template-columns": "5px auto 5px",
				"grid-template-rows": "5px auto 5px",
				"z-index": Number.MAX_SAFE_INTEGER,
			}}
			onPointerDown={() => {
				props.set("panels", (panels) =>
					[...panels].sort((a) => (a.id === props.id ? -1 : 0))
				)
			}}
		>
			<Handle
				{...props}
				x="left"
				y="top"
			/>
			<Handle
				{...props}
				y="top"
			/>
			<Handle
				{...props}
				x="right"
				y="top"
			/>
			<Handle
				{...props}
				x="left"
			/>
			<div
				class={`shadow-[0px_4px_24px_rgba(0,0,0,0.16)] bg-white ${props.mode === "collapsed" ? "" : "rounded-b-[24px]"}`}
			>
				<Header {...props} />
				<Show when={props.mode !== "collapsed"}>{props.element({})}</Show>
			</div>
			<Handle
				{...props}
				x="right"
			/>
			<Handle
				{...props}
				x="left"
				y="bottom"
			/>
			<Handle
				{...props}
				y="bottom"
			/>
			<Handle
				{...props}
				x="right"
				y="bottom"
			/>
		</div>
	)
}
