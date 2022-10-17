import { RouteInfo } from "@/types"
import { lazy } from "solid-js"

export const LeadRRoute: RouteInfo = {
	path: "/lead-r/",
	component: lazy(() => import("./main")),
	welcomeVideo: "./video/path",
	children: [
		{
			path: "/campaigns",
			component: lazy(() => import("./content/campaigns"))
		},
		{
			path: "/analytics",
			component: lazy(() => import("./content/analytics"))
		},
		{
			path: "/leads",
			component: lazy(() => import("./content/leads"))
		}
	]
}
