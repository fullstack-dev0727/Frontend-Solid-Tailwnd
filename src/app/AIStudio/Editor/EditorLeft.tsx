import { useLocation, useNavigate } from "solid-app-router"
import { createSignal, onMount, Show } from "solid-js"
import { addPages, currentPage, state as appState } from "../state"
import { ActorSelect } from "./ActorSelect"
import { FileManager } from "./FileManagerUI/FileManager"
import { Spreadsheet } from "./Spreadsheet"
import { state } from "./state"
import { FileData } from "./types"
// import { postPipeline2 } from "../../../api"
// import { store } from "../../AIStudio/api/client/client"
import { Spinner } from "@/ui/icons/Spinner"
import { generateAudio } from "./api/generatePipeline"

import { muxGetSet } from "./Spreadsheet"
import {
	COMMA,
	getSelectionText,
	getSheetGetSet,
	setSelected,
	setSelection,
} from "./Spreadsheet/src"
import { generated_page } from "@/api2/ai_studio"
import { Page } from "../PageGen/Page"

export const [tabId, setTabId] = createSignal<"database" | "assets" | "page">(
  "database"
)

export const EditorLeft = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [generatingAudio, setGeneratingAudio] = createSignal(false)
  const [input, setInput] = createSignal("")
  const [error, setError] = createSignal("")

  onMount(async () => {
    if (!currentPage()) {
      const { result: { page, widgets } } = await generated_page.read({
        video: appState.currentVideo,
      });
      console.log(page, widgets);
      addPages({
        id: page.id,video_instance: page.video_instance, video: page.video, settings: {
          comments_enabled: page.comments_enabled, default_template: page.default_template, emoji_enabled: page.emoji_enabled,
          vimeo_enabled: page.vimeo_enabled, template_id: ""
        }, widgets: widgets.map((x, i) => { return { ...x, index: `${x.name}-${i}` } })
      });
    }
  })

  return (
    <div>
      <div class="flex items-center justify-between px-4 pt-4">
        <div class="flex gap-3">
          <button
            // disabled={tabId() !== "database"}
            class="cursor-pointer rounded-lg bg-[#4EADF1] py-2 px-2 text-[13px] font-[13px] font-semibold text-white font-[Inter] flex items-center gap-2 hover:bg-[#3A9AE0] duration-75"
            onClick={async () => {
              if (!state.videoUrl)
                return void setError("Please record or select a template video.")
              if (!state.segments.length)
                return void setError("Please select at least one segment matching the column name.")
              setError("")
              setGeneratingAudio(true)
              try {
                await generateAudio(
                  muxGetSet,
                  state.segments.map((s) => s.name),
                  state.videoUrl
                )
              } finally {
                setGeneratingAudio(false)
              }
            }}
          >
            Generate First Names
            <Show when={generatingAudio()}>
              <Spinner />
            </Show>
          </button>
          <button
            class="cursor-pointer rounded-lg bg-[#4EADF1] py-2 px-2 text-[13px] font-[13px] font-semibold text-white font-[Inter] flex items-center gap-2 hover:bg-[#3A9AE0] duration-75"
            onClick={() => {
              const props = getSheetGetSet(muxGetSet)
              setSelected(props, 0, 0)
              setSelection(props, Infinity, Infinity)
              const text = getSelectionText(props, COMMA)
              const file = new Blob([text])
              const a = document.createElement("a")
              a.href = URL.createObjectURL(file)
              a.download = props.get.name + ".csv"
              a.click()
              a.remove()
            }}
          >
            Download CSV
          </button>
        </div>
        <div>
          <ActorSelect />
        </div>
      </div>
      <div class="px-4 pt-1 text-red-500">{error()}</div>
      <div class="flex justify-center gap-5 p-1 mt-3 bg-[#F0F0F0] text-[13px] font-[500]">
        <div
          class="cursor-pointer"
          classList={{ "font-[700]": tabId() === "database" }}
          onClick={() => setTabId("database")}
        >
          Database
        </div>
        <div
          class="cursor-pointer"
          classList={{ "font-[700]": tabId() === "assets" }}
          onClick={() => setTabId("assets")}
        >
          Assets
        </div>
        <div
          class="cursor-pointer"
          classList={{ "font-[700]": tabId() === "page" }}
          onClick={() => setTabId("page")}
        >
          Page
        </div>
      </div>
      <div
        style={{ overflow: "hidden" }}
        classList={{ "h-full": tabId() == "page" }}
      >
        <Show when={tabId() === "page"}>
          <div class="p-2">
            <Page />
          </div>
        </Show>
        <div
          style={{ height: "calc(100vh - 275px)", overflow: "hidden" }}
          classList={{ hidden: tabId() !== "database" }}
        >
          <Spreadsheet fileId={appState.currentVideo} />
        </div>
        </div>
        <Show when={tabId() === "assets"}>
          <div class="p-2">
            <FileManager files={state.files as FileData[]} />
          </div>
        </Show>
      </div>
  )
}
