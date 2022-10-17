import { Component, createEffect, createSignal, For } from "solid-js"
import { AppInfo } from "@/types"

import { useLocation, useNavigate } from "solid-app-router"
import { AppCircle } from "./AppCircle"
import { state } from "@/app/Home/state"

type AppListProps = {
	apps: AppInfo[]
}

export const AppList: Component<AppListProps> = (props) => {
	const navigate = useNavigate()
	const location = useLocation()

	const [isNewUser, setIsNewUser] = createSignal(state.isNewUser)

	createEffect(() => {
		state.isNewUser
		setIsNewUser(localStorage?.getItem("is_new_user") === "1")
	})


	return (
		<For each={props.apps}>
			{(app) => {
				return (
					<AppCircle
						active={
							!app.bottom
								? location.pathname.split("/")[2] === app.id
								: app.id.includes(location.pathname.split("/")[1])
						}
						icon={app.icon}
						notifications={app.notifications}
						theme={app.theme}
						class={app.class ? app.class : ""}
						onClick={() => isNewUser() && app.name !== "Home" ? alert("Please complete profile setup") : navigate(`./${!app.bottom ? "apps/" : ""}${app.id}`)}
						isNewUser={isNewUser() && app.name !== "Home"}
					/>
				)
			}}
		</For>
	)
}
