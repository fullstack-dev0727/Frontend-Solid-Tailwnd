import { createStore } from "solid-js/store"
import { State } from "./types"

export const [state, setState] = createStore<State>({
	currentApp: "apps",
	apps: [
		{
			id: "home",
			icon: "H",
			notifications: 0,
			name: "Home",
			theme: "#4EADF1",
			main: true,
			bottom: false,
		},
		/*
		{
			id: "apps",
			icon: "/icons/apps.svg",
			notifications: 0,
			name: "Apps",
			theme: "#4EADF1",
			main: true,
			bottom: false,
		},
		*/
		{
			id: "address-book",
			icon: "/icons/address_book.svg",
			notifications: 2,
			name: "Address Book",
			theme: "#4BCA58E5",
			main: true,
			bottom: false,
		},
		{
			id: "ai-studio",
			icon: "A",
			notifications: 0,
			name: "AI Studio",
			theme: "black",
			main: false,
			bottom: false,
		},
		/*
		{
			id: "lead-r",
			icon: "L",
			notifications: 1,
			name: "Lead R",
			theme: "#5CBFA7",
			main: false,
			bottom: false,
		},
		*/
		{
			id: "settings/profile",
			icon: "/icons/settings.svg",
			notifications: 0,
			name: "Settings",
			theme: "#1e293b",
			main: false,
			bottom: true,
			class: "bg-slate-800 hover:bg-slate-900",
		},
	],
})

export function setCurrentApp(appId: string) {
	setState("currentApp", appId)
}
