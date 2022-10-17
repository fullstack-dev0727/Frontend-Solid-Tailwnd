import { useLocation, useNavigate } from "solid-app-router"
import { Component, createEffect, createSignal, on, Show } from "solid-js"
import { state } from "../../state"
import { AppList } from "./AppList"

export const AppBar: Component = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const [ref, setRef] = createSignal(localStorage.getItem("tapRef"))

	if (ref()) {
		createEffect(on(() => location.pathname, () => {
			console.log("location changed")
			navigate(location.pathname + `?ref=${ref()}`)
		}))
	}


	return (
		<Show when={!location.pathname.includes("/editor")}>
			<div class="bg-[#E0E0E0] w-16 p-2 pl-0 my-0 z-20 flex flex-col justify-between content-center items-center max-h-screen">
				<div>
					<AppList apps={state.apps.filter((a) => a.main && !a.bottom)} />
					<div class="bg-black/[0.08] w-11 h-[1px] rounded-xl mt-2 ml-2.5" />
					<AppList apps={state.apps.filter((a) => !a.main && !a.bottom)} />
				</div>
				{/* <FolderMenu name={"Other files"} /> */}
				{/* <AppPanelIcon name={"Other files"} /> */}
				<div class="pb-[12px]">
					<AppList apps={state.apps.filter((a) => a.bottom)} />
				</div>
			</div>
		</Show>
	)
}
