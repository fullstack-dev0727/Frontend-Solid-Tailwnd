import { EditorLeft } from "./EditorLeft"
import { EditorRight } from "./EditorRight"
import { SplitPane } from "@/ui/SplitPane"
import { getCurrentVideos, state as appState } from "../state"
import { TopBar } from "./TopBar"
import { LiveCursorProvider } from "./LiveCursorProvider"
import { createSignal, onMount, Show } from "solid-js"
import { video_instances } from "@/api2/ai_studio"
import { Provider as PanelsProvider, ProviderData } from "./Panels"
import { createStore } from "solid-js/store"
import { MinimizedTutorial, TooltipTutorials } from "@/app/Home/Feed/Tutorials/TooltipTutorials"
import { WelcomeTutorial } from "@/app/Home/Feed/Tutorials/WelcomeTutorial"
import { read, User } from "@/api2/user"

const [aiEditor, setAiEditor] = createSignal(true)
const [user, setUser] = createSignal<User>({} as User)
export const [welcomeTutorial, setWelcomeTutorial] = createSignal(true)

export const [tutorialsGet, tutorialsSet] = createStore<ProviderData>({
	panels: [
		{
			id: "editorTutorial",
			title: <span class="p-2">Tutorial</span>,
			element: () => aiEditor() ? <WelcomeTutorial name={user().first_name} isWelcome={welcomeTutorial()} onClick={() => setAiEditor(false)} likes={"349"} />
				: <TooltipTutorials minimize={() => { setAiEditor(true); setWelcomeTutorial(false) }} />,
			mode: "expanded",
			/* 
			NOTE: right and bottom coordinates are relative to the top left corner, 
			so think of x, y, x2, x2 respectively
			*/
			rect: { left: 700, top: 200, right: 500, bottom: 500 },

		},
	],
	snap: false
})

export const Editor = () => {
	const [instanceName, setInstanceName] = createSignal("")

	onMount(async () => {

		const UserResp = await read()
		setUser(UserResp.result)
		if (getCurrentVideos().length) {
			const name = appState.videos.find(
				(video) => video.id === appState.currentVideo
			)?.name
			setInstanceName(name)
			return
		}
		const instance = await video_instances.read({ id: appState.currentVideo })
		setInstanceName(instance.result.name)
	})

	return (
		<>
			<PanelsProvider
				get={tutorialsGet}
				set={tutorialsSet}
			>
				<div class="h-full">
					<TopBar name={instanceName() ?? "Unknown"} />

					<div class="flex h-full w-full">
						<div class="w-10 bg-white border-r-[1px]" />
						<SplitPane
							upper={(t) => t - 500}
							lower={(t) => t - 600}
							left={
								<>
									<EditorLeft />
									<Show when={tutorialsGet.panels[0].mode === "collapsed"}>
										<MinimizedTutorial onClick={() => { tutorialsSet("panels", 0, "mode", "expanded") }} />
									</Show>
								</>
							}
							right={<EditorRight />}
						/>
					</div>
					<LiveCursorProvider />
				</div>
			</PanelsProvider>
		</>
	)
}
