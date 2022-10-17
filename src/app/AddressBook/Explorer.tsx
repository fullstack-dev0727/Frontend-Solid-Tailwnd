import { App } from "@/ui/AppNavigator"
import { Component } from "solid-js"
import { Menu } from "./Menu"

export const Explorer: Component = () => {
	return (
		<App name="address-book">
			<Menu />
		</App>
	)
}
