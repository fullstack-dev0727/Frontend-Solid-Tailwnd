import { FileData as _FileData } from "./FileManagerUI/FileManager"

export type FileData = _FileData

export type TokenData = {
	value: string
	from: number
	to: number
}

export type SegmentData = {
	id: string
	column: number
	name: string
	from: number
	to: number
	creating?: boolean
}

export type EditorState = {
	videoUrl: string
	timelineHeight: number
	files: FileData[]
	segments: SegmentData[]
	backgroundSegments: SegmentData[]
	currentTime: number
	tokens: TokenData[]
	pauses: [number, number][]
}
