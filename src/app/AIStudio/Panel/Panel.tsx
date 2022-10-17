import { Component, createEffect, createSignal, Show } from "solid-js"
import { VideoPlay } from "./VideoPlay"
import { Tabs } from "./Tabs"
import { Outlet } from "solid-app-router"
import { getCurrentVideo } from "../state"
import { formatLastModified } from "./utils"
import { state, loadVideoFromInstance } from "../Editor/state"
import { state as appState } from "../state"
import { useNavigate } from "solid-app-router"
import { currentTabs } from "./state"
import {
	S3_REGION,
} from "../Editor/state"

let curentUrl: any
const currentUrlList = currentTabs().filter((obj) =>
	obj.routeUrl.includes(location.pathname)
)
if (currentUrlList.length > 0) curentUrl = currentUrlList[0]

export const Panel: Component = () => {
	const navigate = useNavigate()
	const [videoUrl, setVideoUrl] = createSignal("")

	createEffect(async () => {
		void appState.currentVideo
		console.log("change detected")
		try {
			await loadVideoFromInstance()
			if (state.videoUrl !== "") {
				setVideoUrl("https://s3." + S3_REGION + ".amazonaws.com/" + state.videoUrl)
			}
			else
				setVideoUrl("")
		} catch {
			setVideoUrl("")
		}
	})

	return (
		<div class="p-2 h-screen overflow-y-scroll no-scrollbar bg-white">
			{getCurrentVideo() ? (
				<>
					<VideoPlay
						name={getCurrentVideo().name || "Unknown"}
						//count={16}
						// time={"26 min ago"}
						time={
							getCurrentVideo()
								? formatLastModified(getCurrentVideo().created_at)
								: ""
						}
						videoUrl={videoUrl()}
						shortUrl={
							"https://raw.githubusercontent.com/gist/Noctem/8f0388e4337e7e01343cc00be3c9a3e0/raw/94bfa84b9493335124e853b8578c711e22fac92e/BigBuckBunny.gif"
						}
						thumbUrl={"/images/video_thumb.png"}
					/>

					<Tabs
						appList={currentTabs()}
						currentTap={curentUrl}
					/>
					{/* <SearchIconButton/>
						<SearchIconButtonExtra/>
						<ThreePointIconButton/>
						<NewIconButton name="New"/>
						<ShopifyButton name="Shopify"/> */}
					<div class="px-[16px]">
						<Outlet />
					</div>
				</>
			) : (
				<div class="flex justify-center items-center h-full">
					<p>Select a video!</p>
				</div>
			)}
		</div>
	)
}
