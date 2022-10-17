
import { createStore } from "solid-js/store"
import { AIStudioState, FolderInfo, SettingsInfo, VideoInfo, WidgetInfo, WorkspaceInfo, PageInfo } from "./types"

export const [state, setState] = createStore<AIStudioState>({
  workspaces: [],
  folders: [],
  videos: [],
  pages: [],
})

export const currentWorkspace = () => state.workspaces.find((w) => w.workspace_id === state.currentWorkspace)

export const currentFolders = () => state.folders.filter(f => f.workspace_id === state.currentWorkspace);

export const currentFolder = () => state.folders.find(f => f.id === state.currentFolder);

export const currentPage = () => state.pages.find(p => p.video === state.currentVideo);

export const setCurrentWorkspace = (id: string) => setState("currentWorkspace", id);

export const addWorkspace = (...workspaces: WorkspaceInfo[]) => setState(
  "workspaces",
  (existing) => [...existing, ...workspaces]
)


export const currentWidgets = () => state.pages.find((page) => page.video === state.currentVideo)?.widgets ?? [];
export const currentSettings = () => state.pages.find((page) => page.video === state.currentVideo)?.settings ?? null;

export const updateSettings = (settings: Partial<SettingsInfo>) => {
  let index = state.pages.findIndex((page) => page.video === state.currentVideo);
  setState("pages", index, "settings", (existing) => {
    return {
      ...existing, ...settings
    }
  })
};

export const addWidget = (...widgets: WidgetInfo[]) => {
  let index = state.pages.findIndex((page) => page.video === state.currentVideo);
  setState("pages", index, "widgets", (existing) => [...existing, ...widgets])
}

export const updateWidget = (id: string, data: string) => {
  let index = state.pages.findIndex((page) => page.video === state.currentVideo);
  setState(
    "pages",
    index,
    "widgets",
    (w) => w.index === id,
    "data",
    data
  )
}

export const removeWidget = (index: string) => {
  let pageIndex = state.pages.findIndex((page) => page.video === state.currentVideo);
  setState("pages",
    pageIndex,
    "widgets",
    (widgets) => widgets.filter(w => w.index !== index)
  )
}


export const setCurrentFolder = (id: string) => {
  setState(
    "currentFolder",
    id
  )
}

export const addFolders = (...folders: FolderInfo[]) => {
  setState(
    "folders",
    (existing) => [...existing, ...folders]
  )
}

export const removeFolder = (folderId: string) => {
  setState(
    "folders",
    (folders) => folders.filter(folder => folder.id !== folderId)
  )
}

export const renameFolder = (folderId: string, newName: string) => {
  setState(
    "folders",
    (f) => f.id === folderId,
    "name",
    newName
  )
}

export const addVideos = (...videos: VideoInfo[]) => {
  setState(
    "videos",
    (exisitng) => [...exisitng, ...videos]
  )
}

export const addPages = (...pages: PageInfo[]) => {
  setState(
    "pages",
    (existing) => [...existing, ...pages]
  )
}



export const getCurrentVideos = () => state.videos.filter(v => v.folder_id === state.currentFolder);

export const getCurrentVideo = () => state.videos.find(v => v.id === state.currentVideo);

export const setCurrentVideo = (id?: string) => setState("currentVideo", id);

export const renameVideo = (id: string, name: string) => {
  setState(
    "videos",
    (f) => f.id === id,
    "name",
    name
  )
}

export const removeVideo = (id: string) => {
  setState(
    "videos",
    (v) => v.filter(v => v.id !== id)
  )
}
