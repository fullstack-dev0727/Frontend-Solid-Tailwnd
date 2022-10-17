import { useRoutes, Router, useLocation } from "solid-app-router"
import { Component, createEffect, createSignal, Show } from "solid-js"
import { AppBar } from "./ui/AppBar"
import { AIStudioRoute } from "./app/AIStudio"
import { AddressBookRoute } from "./app/AddressBook"
import { RouteInfo } from "./types"
import { AppWelcome } from "./ui/AppWelcome"
import { HomeRoute } from "./app/Home"
import { VerifyAuthRoute } from "./VerifyAuth"
import { SettingsRoute } from "./app/Settings"
// import webSockectApi from "./websockect/webSockectApi"
import { Portal } from "solid-js/web"
import { PaymentSuccessModal } from "@/ui/Modals/PaymentSuccess"
import { PaymentFailModal } from "@/ui/Modals/PaymentFail"
import { FallBackRoute } from "./Fallback"
import { fetchSettingsState, state } from "./app/Settings/state"
import { v4 as uuidv4 } from 'uuid';
import Tap from "@tapfiliate/tapfiliate-js"

const routes: RouteInfo[] = [
	HomeRoute,
	AIStudioRoute,
	AddressBookRoute,
	VerifyAuthRoute,
	SettingsRoute,
	FallBackRoute
]



const App: Component = () => {
	/////////////////////////////MODAL/////////////////////////////
	const success = window.location.href.includes("success=true")
	const error = window.location.href.includes("success=false")
	const [modal, setModal] = createSignal(false)
	const [videoNumber, setVideoNumber] = createSignal(0)
	const [ref, setRef] = createSignal(localStorage.getItem("tapRef"))

	createEffect(async () => {
		Tap.init('35081-205a3d');

		if (error == true) {
			setModal(true);
		} else {
			const plan_id = window.location.href.split("/").pop();
			if (plan_id != null) {
				if (!state?.Plans || !state?.userPlan) {
					await fetchSettingsState();
					setModal(success)

					if (modal()) {
						// parse url
						// const num = Number(window.location.href.split("/").pop())
						
						const num = state?.Plans?.find((plan) => plan.id === plan_id).soft_limit
						const price = Number(state?.Plans?.find((plan) => plan.id === plan_id).price)
						setVideoNumber(!num ? 0 : num)
						if (price > 0) {						
							Tap.conversion(uuidv4(), price, {customer_id: state.user.user_id });
						}
					}					
				}
			}
		}		
	})
	////////////////////////////////////////////////////////////////
	// const { webSockectConnect } = webSockectApi()

	// webSockectConnect();

	// A default welcome page for all apps, which can have a different video attached to it,
	// based on the app.
	for (const route of routes) {
		if (!route.notApp) route.path = `/apps${route.path}`
		if (route.welcomeVideo) {
			if (Array.isArray(route.children))
				route.children.unshift({
					path: "/",
					component: () => <AppWelcome welcomeVideo={route.welcomeVideo} />,
				})
			else
				route.children = [
					{
						path: "/",
						component: () => <AppWelcome welcomeVideo={route.welcomeVideo} />,
					},
				]
		}
	}

	const Routes = useRoutes(routes)

	return (
		<Router>
			<div class="bg-white min-h-screen w-full flex">
				<AppBar />
				<Routes />
				<Show when={modal()}>
					<Portal>
						<Show
							when={success}
							fallback={
								<PaymentFailModal
									closeEvent={() => {
										setModal(false)
										if (ref()) {
											location.href = `/?ref=${ref()}`										
										} else {
											location.href = "/"
										}
									}}
									videoNumber={videoNumber()}
								/>
							}
						>
							<PaymentSuccessModal
								closeEvent={() => {
									setModal(false)
									if (ref()) {
										location.href = `/?ref=${ref()}`										
									} else {
										location.href = "/"
									}
								}}
								videoNumber={videoNumber()}
							/>
						</Show>
					</Portal>
				</Show>
			</div>
		</Router>
	)
}

export default App
