import { RouteInfo } from "@/types"
import { lazy } from "solid-js"

export const HomeRoute: RouteInfo = {
	path: "/home",
	component: lazy(() => import("./main")),
}
