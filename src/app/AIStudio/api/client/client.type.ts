export type Folder = {
	id: string
	name: string
	// not from api but settled on initial method
	files: Required<ClientOptionsFile<File>>[]
}

export type ClientOptionsFolder<P = {}> = P & {
	isopen: boolean
}

export type File = {
	// fetched from API
	id: string
	folder_id: string
	name: string
	actor_id?: string
	video_id?: string
	audio_batch_id?: string
}

export enum Tab {
	Video,
	Audio,
<<<<<<<< HEAD:src/views/Workspace/api/client/client.type.ts
========
	Preview,
	// Library,
>>>>>>>> c61c75a92207063fd9b3fd5b5f83329f8b182cc3:src/app/AIStudio/api/client/client.type.ts
}

// locally used by app
export type ClientOptionsFile<P = {}> = P & {
	isactive: boolean
	isopen: boolean
	video_url: string | undefined
	video_duration: number | undefined
	segments: { name: string; progressStamps: [number, number] }[] | undefined
	active_tab: Tab
	table: Table
}

type Table = {
	columns: Column[]
}

type Column = {
	x: number
	label: string
	cells: Cell[]
	uniqueLabels: string[]
}

type Cell = {
	x: number
	y: number
	label: string
	audioURL: string | null
	audioId: string | null
}
