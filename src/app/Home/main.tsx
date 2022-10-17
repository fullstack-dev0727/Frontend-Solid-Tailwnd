import { createSignal, Show, onMount } from "solid-js"
import { Explorer } from "./Explorer"
import { Feed } from "./Feed/Feed"
import { updatePagination, feedState } from "./Feed/handlers/fetch_feed"
import { InviteSideBar } from "./Feed/InviteSideBar"
import { isNewUser } from "./state"
import { Steps } from "./Steps"

const [email, setEmail] = createSignal("")

export const [activeTab, setActiveTab] = createSignal("Feed")

export const Home = () => {
	const cookieData = document.cookie
		.split(";")
		.map((cookie) => {
			const [key, value] = cookie.split("=")
			return { [key.trim()]: value }
		})
		.filter((cookie) => cookie?.authToken)[0]?.authToken

	if (cookieData !== undefined) {
		const cookieObj = JSON.parse(cookieData)

		localStorage.setItem("access_token", cookieObj.access_token)
		localStorage.setItem("refresh_token", cookieObj.refresh_token)
		localStorage.setItem("user_id", cookieObj.user_id)
		localStorage.setItem("email", cookieObj.email)
	}

	setEmail(localStorage.getItem("email") || "")

	onMount(() => {
		document.getElementById("feed")?.addEventListener("scroll", async () => {
			if (
				document.getElementById("feed").scrollTop +
					document.getElementById("feed").clientHeight ===
				document.getElementById("feed").scrollHeight
			) {
				// bottom of the container
				if (!feedState.pageLoading) await updatePagination()
			}
		})
	})
	return (
		<div class="flex w-full">
			<Explorer />
			<Show when={isNewUser()}>
				<div class="flex justify-center items-center bg-gray-300 w-full">
					<Steps />
				</div>
			</Show>

			<Show when={!isNewUser()}>
				<Show when={activeTab() === "Feed"}>
					<div
						id="feed"
						class="flex justify-center bg-[#FFFFFF] w-full overflow-scroll h-screen"
					>
						<Feed />
					</div>
				</Show>
			</Show>
			<Show when={false}>
				<InviteSideBar />
			</Show>
		</div>
	)
}

export default Home
