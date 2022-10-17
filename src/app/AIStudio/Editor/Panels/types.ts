import { Component, JSXElement } from "solid-js";
import { SetStoreFunction } from "solid-js/store";

export type YDirection = "top" | "bottom";
export type XDirection = "left" | "right";

export type Direction = XDirection | YDirection;

export type RectData = Record<Direction, number>;

export const modes = [
	"collapsed",
	"expanded",
	"minimized",
	"maximized",
] as const;

export type Mode = typeof modes[number];

export interface PanelData {
	id: string;
	title: JSXElement;
	element: Component;
	rect: RectData;
	mode: Mode;
}

export interface ProviderData {
	panels: PanelData[];
	x?: XDirection;
	y?: YDirection;
	frameX?: XDirection;
	frameY?: YDirection;
	left0?: number;
	top0?: number;
	right0?: number;
	bottom0?: number;
	x0?: number;
	y0?: number;
	snap?:Boolean
}

export interface ProviderGetSet {
	get: ProviderData;
	set: SetStoreFunction<ProviderData>;
}
