import { Component, createSignal, Show } from "solid-js"
import { Panel } from "./Panel/Panel"
import { SplitPane } from "@/ui/SplitPane"
import { VideoInstanceList } from "./VideoInstanceList"
import { useLocation, useParams } from "solid-app-router"
import { setState } from "./state"
import { Editor } from "./Editor/Editor"
import { MinimizedTutorial, TooltipTutorials } from "../Home/Feed/Tutorials/TooltipTutorials"
import { Provider as PanelsProvider, ProviderData } from "./Editor/Panels"
import { createStore } from "solid-js/store"


export const FileExplorer: Component = () => {
	const location = useLocation()
	const params = useParams()

	const [panelsGet, panelsSet] = createStore<ProviderData>({
		panels: [
			{
				id: "studioTutorial",
				title: <span class="p-2">Tutorial</span>,
				element: () => <TooltipTutorials isAiStudio={true} />,
				mode: "expanded",
				/* 
				NOTE: right and bottom coordinates are relative to the top left corner, 
				so think of x, y, x2, x2 respectively
				*/
				rect: { left: 950, top: 300, right: 0, bottom: 0 },
			},
		],
		snap: false,
	})

	// @ts-ignore - debug
	globalThis.params = params

	const isEditor = () => location.pathname.includes("/editor")

	if (isEditor()) {
		setState("currentVideo", location.pathname.split("/").slice(-1)[0])
	}

	return (
		<div class="h-full">
			<Show when={isEditor()}>
				<Editor />
			</Show>

			<Show when={!isEditor()}>
				<PanelsProvider
					get={panelsGet}
					set={panelsSet}
				>
					<SplitPane
						upper={(t) => t - 500}
						lower={(t) => t - 600}
						left={
							<div class="relative">
								<VideoInstanceList />
								<Show when={panelsGet.panels[0].mode === "collapsed"}>
									<MinimizedTutorial onClick={() => { panelsSet("panels", 0, "mode", "expanded") }} />
								</Show>
							</div>
						}
						right={<Panel />}
					/>
				</PanelsProvider>
			</Show>
		</div>
	)
}

export default FileExplorer
