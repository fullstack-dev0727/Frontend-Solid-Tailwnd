import { Component, Show } from "solid-js"
import { Menu } from "./Menu"
import { ContextMenuProvider } from "./ContextMenu"
import { App } from "@/ui/AppNavigator"
import { devLogin } from "@/devLogin"
import { useLocation } from "solid-app-router"

export const AIStudio: Component = () => {
	const location = useLocation()
	// @ts-expect-error - inject devLogin into window
	globalThis.devLogin = devLogin
	return (
		<>
			<App name="ai-studio">
				<Show when={!location.pathname.includes("/editor")}>
					<Menu />
				</Show>
			</App>
			<ContextMenuProvider />
		</>
	)
}

export default AIStudio
