import { Component } from "solid-js"

export type StaticIconProps = {
	size: number
}

export type ActiveIconProps = {
	active: boolean
	size: number
}

export type ActiveIcon = Component<ActiveIconProps>

export type StaticIcon = Component<StaticIconProps>
