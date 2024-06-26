import { createSelector, createSignal } from "solid-js"
import { Outlet, useNavigate } from "solid-app-router"
import { fetchSettingsState } from "./state"
import { Folder } from "../../ui/Button/Folder"

const routes = [
	{
		label: "Profile",
		path: "./profile",
	},
	{
		label: "Billing",
		path: "./billing",
	},
	{
		label: "Zapier",
		path: "./zapier",
	},
]

export const Settings = () => {
	const [active, setActive] = createSignal("Profile")

	const isActive = createSelector(active)
	const navigate = useNavigate()
	fetchSettingsState()

	return (
		<>
			<main class="w-60 min-h-screen shrink-0 bg-slate-100 shadow-md  shadow-slate-300 z-0 flex flex-col">
				<div class="w-full px-3 py-2.5 border-b-2 font-semibold text-slate-600">
					<h1>Settings</h1>
				</div>
				<div class="flex w-full items-center justify-center p-4">
					{/* <FreeVideoBtnWithDialog /> */}
				</div>
				<div class="w-full px-3 flex flex-col gap-y-0.5">
					<h1 class="pl-2">General </h1>
					<div class="flex flex-col gap-y-0.5">
						{routes.map(({ path, label }) => (
							<Folder
								active={isActive(label)}
								label={label}
								onClick={() => {
									navigate(path)
									setActive(label)
								}}
							/>
						))}
						{/* <Folder
							active={isActive("Profile")}
							label="Profile"
							onClick={() => {
								navigate("./profile")
								setActive("Profile")
							}}
						/>
						<Folder
							active={isActive("Billing")}
							label="Billing"
							onClick={() => {
								navigate("./billings")
								setActive("Billing")
							}}
						/>
						<Folder
							active={isActive("Security")}
							label="Security"
							onClick={() => {
								navigate("./security")
								setActive("Security")
							}}
						/> */}
					</div>
				</div>
				<div class="w-full px-3 py-2 flex flex-col gap-y-0.5">
					<h1 class="pl-2">Apps </h1>
					<div class="flex flex-col pt-0.5 gap-y-0.5">
						<Folder
							active={isActive("AI Studio")}
							label="AI Studio"
							onClick={() => {
								navigate("./ai_studio")
								setActive("AI Studio")
							}}
						/>
					</div>
				</div>
			</main>
			<div class="min-h-screen max-h-screen overflow-y-scroll w-full flex flex-col bg-white">
				<div class="px-3 py-2.5 border-b-2 font-semibold text-slate-900">
					<h1>{active()}</h1>
				</div>
				<Outlet />
			</div>
		</>
	)
}

export default Settings
