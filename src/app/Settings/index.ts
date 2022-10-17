import { lazy } from "solid-js"
import { RouteInfo } from "@/types"

export const SettingsRoute: RouteInfo = {
	path: "/settings",
	component: lazy(() => import("./main")),
	notApp: true,
	children: [
		{
			path: "/profile",
			component: lazy(() => import("./Profile")),
		},
		{
			path: "/billing",
			component: lazy(() => import("./Billing")),
		},
		{
			path: "/zapier",
			component: lazy(() => import("./Zapier")),
		},
		{
			path: "/ai_studio",
			component: lazy(() => import("./AIStudio")),
		},
		// {
		// 	path: "security",
		// 	component: lazy(() => import("./Security")),
		// },
	],
}
