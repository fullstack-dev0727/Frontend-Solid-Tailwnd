import { RouteInfo } from "@/types"
import { lazy } from "solid-js"

export const AIStudioRoute: RouteInfo = {
	path: "/ai-studio/",
	component: lazy(() => import("./AIStudio")),
	// welcomeVideo: "/welcome/test",
	children: [
		{
			path: "/",
			component: lazy(() => import("./FileExplorer"))
		},
		{
			path: "/folder/:folder",
			component: lazy(() => import("./FileExplorer")),
			children: [
				{ path: "/", component: lazy(() => import("./AppDetail/Overview")) },
				{ path: "/videos", component: lazy(() => import("./AppDetail/Videos")) },
				//	{ path: "/comments", component: lazy(() => import("./AppDetail/Comments")) },
				{ path: "/files", component: lazy(() => import("./AppDetail/Files")) },
				//	{ path: "/analytics", component: lazy(() => import("./AppDetail/Analytics")) }
				{ path: "/editor/:file", element: "Editor" },
			],
		},
	],
}
