export interface CreateWorkspace {
	description: string
	generated_videos_quota: number
	parent_videos_quota: number
	name: string
	role: string
}

export interface UpdateWorkspace extends CreateWorkspace {
	id: string
}

export interface Workspace extends UpdateWorkspace {
	created_at: string
	description: string
	name: string
	role: string
	updated_at: string
	user_id: string
	workspace_id: string
}
