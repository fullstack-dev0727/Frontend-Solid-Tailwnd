import { GeneratedVideo } from "@/api2/ai_studio"
import { createSignal } from "solid-js"
import { createStore } from "solid-js/store"

export interface Tab {
    name: string,
    count: number,
    routeUrl: string
}
export type TabCount = Omit<Tab, "routeUrl">

export type PanelState = {
    tabs: Tab[],
    generatedVideos: GeneratedVideo[]
}


export const [totalCount, setTotalCount] = createSignal<number>(0)

export const [state, setState] = createStore<PanelState>({
    tabs: [
        {
            name: "Overview",
            count: 0,
            routeUrl: "./",
        },

        {
            name: "Videos",
            count: 0,
            routeUrl: "./videos",
        },
        /*
        {
            name: "Comments",
            count: 2,
            routeurl: "./comments",
        },
        */
        {
            name: "Files",
            count: 0,
            routeUrl: "./files",
        },
        /*
        {
            name: "Analytics",
            count: 6,
            routeurl: "./analytics",
        },
        */
    ],
    generatedVideos: [],
})

export const generatedVideos = () => state.generatedVideos

export const setGeneratedVideos = (videos: GeneratedVideo[]) => setState("generatedVideos", videos)

export const getGeneratedVideo = (id: string) => state.generatedVideos.find((v) => v.id === id)

export const currentTabs = () => state.tabs;

export const updateTabCount = (count: TabCount) => {

    setTotalCount(state.tabs.filter((t) => t.name !== "Overview").reduce((a, b) => a + b.count, 0))

    let index = state.tabs.findIndex((tab) => tab.name === count.name);
    setState("tabs", index, "count", count.count);

    console.log("---------------" + totalCount())
    setState("tabs", 0, "count", totalCount());
}

