import { lazy } from "solid-js"
import { RouteInfo } from "./types"

export const Fallback = () => {
    return (
        <div class="flex flex-col items-center justify-center h-screen w-full">
            <div class="flex flex-col items-center justify-center">
                <h1 class="text-9xl font-bold">404</h1>
                <h2 class="text-2xl font-semibold">Page not found</h2>
            </div>
        </div>
    )
}

export const FallBackRoute:RouteInfo = {
    path: "/*",
	component: lazy(() => import("./Fallback")),
}

export default Fallback;
