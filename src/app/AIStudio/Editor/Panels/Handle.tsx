import { Component } from "solid-js";
import {
	Direction,
	PanelData,
	ProviderGetSet,
	XDirection,
	YDirection,
} from "./types";
import { cursor as cursorType } from "./utils";

export interface HandleProps extends PanelData, ProviderGetSet {
	x?: XDirection;
	y?: YDirection;
}

export const Handle: Component<HandleProps> = (props) => {
	return (
		<div
			style={{
				cursor: cursorType(props.x, props.y),
				background:
					props.get.x === props.x &&
					props.get.y === props.y &&
					props.get.panels[0].id === props.id
						? "dodgerblue"
						: "transparent",
			}}
			onPointerDown={(e) => {
				e.preventDefault();
				props.set("x", props.x);
				props.set("y", props.y);
			}}
		/>
	);
};
