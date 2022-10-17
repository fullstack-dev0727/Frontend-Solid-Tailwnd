import { VideoInstance, Folder, Widget, Settings } from "@/api2/ai_studio"


export type FolderInfo = Folder;
export type WidgetInfo = Widget & { index: string };
export type SettingsInfo = Settings;
export type VideoInfo = Omit<VideoInstance, "created_at"> & { created_at: Date };

export type WorkspaceInfo = {
  workspace_id: string
  name: string
}

export type PageInfo = {
  settings: Settings,
  video_instance: string,
  widgets: WidgetInfo[],
  video: string,
  id: string
}


export type AIStudioState = {
  workspaces: WorkspaceInfo[],
  folders: FolderInfo[],
  videos: VideoInfo[],
  pages: PageInfo[],
  currentWorkspace?: string,
  currentFolder?: string,
  currentVideo?: string
}
