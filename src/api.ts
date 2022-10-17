import axios from "axios"
import { UserDetails, Workspace } from "./views/ControlPanel/index.type"

import "./helpers/env"

const baseURL = import.meta.env.VITE_API_URL

const axiosApi = axios.create({
  // baseURL: "https://api.hailey.ai/api",
  baseURL: baseURL,
})

export type APIResult<T = any> = Promise<{
  data: {
    result: T
    code?: number
  }
}>

// Request interceptor for API calls
axiosApi.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("access_token")
    if (token)
      config.headers = {
        Authorization: `Bearer ${token}`,
      }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// if a 401 happens, when token is expired
// TODO: uncertain typescript fix
const interceptorId = axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error && error.response && error.response.status === 401) {
      originalRequest._retry = true

      axios.interceptors.response.eject(interceptorId)

      originalRequest.headers.token = "jscanvas"

      return axios(originalRequest)
    }
    return Promise.reject(error)
  }
)

export default axiosApi

export const fetchUserDetails = async (): APIResult<UserDetails> =>
  await axiosApi.get("user")

export const updateUser = async (update: Partial<UserDetails>) =>
  await axiosApi.put("user", update)

export const createUser = async (create: {
  first_name: string
  last_name: string
  phone?: string
  email?: string
}): APIResult => axiosApi.post("user", create)

// workspaces
export const fetchWorkspaces = async (): APIResult<Workspace[]> =>
  await axiosApi.get("workspace")

export const createWorkspace = async (data: {
  name: string
  role: string
  description: string
}) => await axiosApi.post("workspace", data)

// Folders
/* 
    Get ✅
    Add ✅
    Rename ✅
    Remove ✅
*/
export const fetchFolders = async ({
  workspace_id,
}: {
  workspace_id?: string
}): APIResult => {
  if (workspace_id)
    return await axiosApi.get(`ai_studio/folder?workspace_id=${workspace_id}`)
  else return await axiosApi.get("ai_studio/folder")
}

export const fetchFolder = async ({
  folder_id,
}: {
  folder_id: string
}): APIResult => await axiosApi.get(`ai_studio/folder?id=${folder_id}`)

export const addFolder = async ({
  name,
  workspace_id,
}: {
  name: string
  workspace_id: string
}): APIResult => await axiosApi.post("ai_studio/folder", { name, workspace_id })

export const renameFolder = async ({
  folder_id,
  name,
}: {
  folder_id: string
  name: string
}): APIResult => await axiosApi.put(`ai_studio/folder`, { name, id: folder_id })

export const removeFolder = async ({
  folder_id,
}: {
  folder_id: string
}): APIResult => await axiosApi.delete(`ai_studio/folder?id=${folder_id}`)

// Files
/* 
    Get ✅
    Add ✅
    Rename ✅
    remove ✅ 
*/

export const fetchFiles = async ({
  workspace_id,
  folder_id,
}: {
  folder_id?: string
  workspace_id?: string
}): APIResult => {
  if (folder_id)
    return await axiosApi.get(`ai_studio/video_instance?id=${folder_id}`)
  if (workspace_id)
    return await axiosApi.get(
      `ai_studio/video_instance?workspace_id=${workspace_id}`
    )
}

export const fetchFile = async ({ file_id }: { file_id: string }): APIResult =>
  await axiosApi.get(`ai_studio/video_instance?id=${file_id}`)

export const addFile = async ({
  name,
  folder_id,
}: {
  name: string
  folder_id: string
}): APIResult =>
  await axiosApi.post("ai_studio/video_instance", {
    name,
    folder_id,
  })

export const renameFile = async ({
  file_id,
  name,
}: {
  file_id: string
  name: string
}): APIResult =>
  await axiosApi.put(`ai_studio/video_instance`, { id: file_id, name })

export const removeFile = async ({ file_id }: { file_id: string }): APIResult =>
  await axiosApi.delete(`ai_studio/video_instance?id=${file_id}`)

export const updateFileAudioData = async ({
  file_id,
  audio_batch_id,
  actor_id,
}: {
  file_id: string
  audio_batch_id: string
  actor_id: string
}): APIResult =>
  await axiosApi.put(`ai_studio/video_instance`, {
    id: file_id,
    audio_batch_id,
    actor_id,
  })

export const updateFileVideoInstanceId = async ({
  file_id,
  video_id,
}: {
  file_id: string
  video_id: string
}): APIResult =>
  await axiosApi.put(`ai_studio/video_instance?id=${file_id}`, { video_id })

export const postPipeline = async ({
  file_id,
  lipsync_with_image,
}: {
  actor_id: string
  video_id: string
  file_id: string
  lipsync_with_image: boolean
}): APIResult =>
  await axiosApi.post("pipeline", {
    lipsync_with_image,
    video_instance_id: file_id,
  })

export const postPipeline2 = async ({
  actor_id,
  video_id,
  ranges,
  rows,
}: {
  actor_id: string
  video_id: string
  ranges: [string, string][]
  rows: string[][]
}): APIResult =>
  await axiosApi
    .post("ai_studio/pipeline", {
      actor_id,
      video_id,
      ranges,
      rows,
    })
    .catch((resp) => resp?.response)

// segments
export const postSegment = async (segment: {
  video_instance_id: string
  prefix_time_marker_start: string
  prefix_time_marker_end: string
  suffix_time_marker_start: string
  suffix_time_marker_end: string
  audio_variable_name: string
  audio_variable_column_id: number
  variable_time_marker_start: string
  variable_time_marker_end: string
}): APIResult => await axiosApi.post("segment", segment)

export const fetchSegment = async ({
  segment_id,
}: {
  segment_id: string
}): APIResult => await axiosApi.get(`segment?id=${segment_id}`)

export const fetchSegments = async ({
  file_id,
}: {
  file_id: string
}): APIResult => await axiosApi.get(`segment?video_instance_id=${file_id}`)

// Video
/* 
    Get ✅
    Add ✅
    Rename ✅
    remove ✅ 
*/
export const fetchVideos = async (): APIResult => await axiosApi.get(`video`)

export const postVideo = async ({
  duration,
  formData,
}: {
  duration: string
  formData: FormData
}): APIResult =>
  await axiosApi.post(`upload_video?length=${duration}`, formData)

export const fetchVideo = async ({
  video_id,
}: {
  video_id: string
}): APIResult => await axiosApi.get(`video?id=${video_id}`)

export const retrieveVideo = async ({
  video_id,
}: {
  video_id: string
}): APIResult =>
  await axiosApi.get(`fetch_video?id=${video_id}`, { responseType: "blob" })

export const deleteVideo = async ({
  video_id,
}: {
  video_id: string
}): APIResult => await axiosApi.delete(`video?id=${video_id}`)

// actor
export const addActor = async ({ name }: { name: string }): APIResult =>
  await axiosApi.post("actor", { name: name })
export const fetchActors = async () => await axiosApi.get(`actor`)
export const fetchActor = async ({ actor_id }: { actor_id: string }) =>
  await axiosApi.get(`actor?id=${actor_id}`)
export const deleteActor = async ({ actor_id }: { actor_id: string }) =>
  await axiosApi.delete(`actor?id=${actor_id}`)

// audio_batch
export const addAudioBatch = async ({ name }: { name: string }): APIResult =>
  await axiosApi.post("audio_batch")

export const getAllAudioBatch = async (): APIResult =>
  await axiosApi.get("audio_batch")

export const deleteAudioBatch = async ({
  audio_batch_id,
}: {
  audio_batch_id: string
}): APIResult => await axiosApi.delete(`audio_batch?id=${audio_batch_id}`)

// audio_batch_data
// POST /api/audio_batch_data?audio_batch_id={}
// 	form-data{"file":"csv file path"}
export const postAudioBatchData = async ({
  audio_batch_id,
  formData,
}: {
  audio_batch_id: string
  formData: FormData
}): APIResult =>
  await axiosApi.post(
    `audio_batch_data?audio_batch_id=${audio_batch_id}`,
    formData
  )

export const fetchCSVFromAudioBatchData = async ({
  audio_batch_id,
  actor_id,
}: {
  actor_id: string
  audio_batch_id: string
}): APIResult =>
  await axiosApi.get(
    `audio_batch_data?audio_batch_id=${audio_batch_id}&actor_id=${actor_id}`
  )

export const fetchAudio = async ({
  audio_id,
}: {
  audio_id: string
}): APIResult =>
  await axiosApi.get(`fetch_audio?id=${audio_id}`, {
    responseType: "blob",
  })

export const fetchAudioData = async ({
  name,
  actor_id,
}: {
  name: string
  actor_id: string
}): APIResult => await axiosApi.get(`audio?actor_id=${actor_id}&&name=${name}`)

// audio
export const postAudio = async ({
  name,
  actor_id,
  length,
  formData,
}: {
  name: string
  actor_id: string
  length: string
  formData: FormData
}): APIResult =>
  await axiosApi.post(
    `audio?actor_id=${actor_id}&name=${name}&audio_length=${length}`,
    formData
  )

export const renameAudio = async ({
  name,
  audio_id,
}: {
  name: string
  audio_id: string
}): APIResult => await axiosApi.put(`audio?id=${audio_id}`, { name })

export const deleteAudio = async ({
  audio_id,
}: {
  audio_id: string
}): APIResult => await axiosApi.delete(`audio?id=${audio_id}`)

// CSV Data
export const fetchAllCSV = async (): APIResult => await axiosApi.get("csv")

export const fetchCSV = async ({ csv_id }: { csv_id: string }): APIResult =>
  await axiosApi.get(`csv?id=${csv_id}`)

export const postCSV = async ({
  formData,
}: {
  formData: FormData
}): APIResult => await axiosApi.post("upload_csv", formData)

export const fetchJsonFromCSV = async ({
  csv_id,
}: {
  csv_id: string
}): APIResult => await axiosApi.get(`convert_csv?id=${csv_id}`)

export const exportGeneratedVideoAsCSV = async ({
  file_id,
}: {
  file_id: string
}): APIResult => await axiosApi.get(`export_csv?video_instance_id=${file_id}`)

export const verifyAuth = async (data: {
  token: string
  user_id?: string
}): APIResult => await axiosApi.post("verify/oauth", data)

export const syncContacts = async (data: {
  email?: string
  phone?: string
  provider: string
  token: string
}): APIResult => await axiosApi.post("contacts", data)

export const sendInvite = async (data: {
  sender: {
    first_name: string
    last_name?: string
  }
  receivers: Array<{
    email?: string
    phone?: string
    first_name: string
    last_name?: string
  }>
}): APIResult => await axiosApi.post("invite", data)

export const getContacts = async (data: {
  provider: string
  query?: string
  size?: number
  page?: number
}): APIResult =>
  await axiosApi.get(
    `contacts?provider=${data.provider}&size=${data.size || 10}&page=${data.page || 0
    }${data.query ? `&query=${data.query}` : ""}`
  )

export const getTags = async (): APIResult => await axiosApi.get("contacts/tag")

export const createTag = async (data: { name: string }): APIResult =>
  await axiosApi.post("contacts/tag", data)

export const updateTag = async (data: {
  id: string
  name: string
}): APIResult => await axiosApi.put("contacts/tag", data)

export const deleteTag = async (id: string): APIResult =>
  await axiosApi.delete(`contacts/tag?id=${id}`)

export const getTagGroup = async (tagId: string): APIResult =>
  await axiosApi.get(`contacts/group?id=${tagId}`)

export const addContactToTag = async (data: {
  identifier: string
  tag_id: string
}) => await axiosApi.post("contacts/group", data)

export const removeContactFromTag = async (data: {
  identifier: string
  tag_id: string
}) => await axiosApi.delete("contacts/group", { data })
