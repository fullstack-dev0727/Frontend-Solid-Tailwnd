export interface CreateActor {
	name: string
}

export interface UpdateActor extends CreateActor {
	id: string
}

export interface Actor extends UpdateActor {
	created_at: string
	updated_at: string
	user_id: string
}

export interface CreateFolder {
	name: string
	workspace_id?: string
}

export interface UpdateFolder extends CreateFolder {
	id: string
}

export interface Folder extends UpdateFolder {
	created_at: string
	updated_at: string
	user_id: string
}

export interface CreateSegment {
	audio_variable_column_id: number
	audio_variable_name: string
	prefix_time_marker_end: string
	prefix_time_marker_start: string
	suffix_time_marker_end: string
	suffix_time_marker_start: string
	variable_time_marker_end: string
	variable_time_marker_start: string
	video_instance_id: string
}

export interface UpdateSegment {
	id: string
	audio_variable_name: string
}

export type Segment = UpdateSegment & CreateSegment

export interface CreateVideoInstance {
	name: string
	folder_id: string
}

export interface UpdateVideoInstance extends CreateVideoInstance {
	id: string
	actor_id: string
	audio_batch_id: string
	image_column_id: string
	video_id: string
}

export interface CreateWidget {
	id: string,
	name: string,
	data: string
}

export interface UpdateWidget extends CreateWidget {
	id: string
}

export interface Widget extends UpdateWidget {
	id: string,
}

export interface Settings {
	vimeo_enabled: boolean,
	emoji_enabled: boolean,
	comments_enabled: boolean,
	default_template: boolean,
	template_id: string
}

export interface CreatePageData {
	page: {
		name: string,
		video: string,
		video_instance: string,
		vimeo_enabled: boolean,
		emoji_enabled: boolean,
		comments_enabled: boolean,
		default_template: boolean,
	},
	widgets: CreateWidget[]
}

export interface PageInput {
	id: string,
    input: string,
    page: string,
}

export interface PageData {
	page: {
		id: string,
		name: string,
		video: string,
		video_instance: string,
		vimeo_enabled: boolean,
		emoji_enabled: boolean,
		comments_enabled: boolean,
		default_template: boolean
	},
	widgets: Widget[]
}

export interface UpdatePageData {
	page: {
		id: string,
		video: string,
		name: string,
	},
	widgets: UpdateWidget[]
}

export type VideoInstance = UpdateVideoInstance & {
	created_at: string
}

export interface VoiceGenResult {
	file_path: string,
    similarity: string,
}