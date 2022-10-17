import { repo } from "../repo"
import {
  Actor,
  CreateActor,
  CreateFolder,
  CreatePageData,
  CreateSegment,
  CreateVideoInstance,
  Folder,
  PageData,
  Segment,
  UpdateActor,
  UpdateFolder,
  UpdatePageData,
  UpdateSegment,
  UpdateVideoInstance,
  VideoInstance,
} from "./types"

export * from "./types"
export * as audios from "./audios"
export * from "./generatedVideos"

export const actors = repo<
  CreateActor,
  { id: string },
  Record<never, never>,
  UpdateActor,
  { id: string },
  Actor
>("api/ai_studio/actor", "https://studio.dev.bhuman.ai/")

export const folders = repo<
  CreateFolder,
  { id: string; workspace_id?: string },
  { workspace_id: string },
  UpdateFolder,
  { id: string },
  Folder
>("api/ai_studio/folder", "https://studio.dev.bhuman.ai/")

export const segments = repo<
  CreateSegment,
  { id: string; video_instance_id?: string },
  { video_instance_id: string },
  UpdateSegment,
  { id: string },
  Segment
>("api/ai_studio/segment", "https://studio.dev.bhuman.ai/")

export const video_instances = repo<
  CreateVideoInstance,
  { id: string },
  { workspace_id: string },
  Partial<UpdateVideoInstance>,
  { id: string },
  VideoInstance
>("api/ai_studio/video_instance", "https://studio.dev.bhuman.ai/")

export const generated_page = repo<
  CreatePageData,
  {
    video_instance?: string
    video: string
    name?: string
  },
  {
    video_instance?: string
    video: string
    name?: string
  },
  UpdatePageData,
  { video: string },
  PageData
>("api/ai_studio/generated_page", "https://page.dev.bhuman.ai/")
