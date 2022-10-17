export interface Comment {
	comment: string
	created_at?: string
	fullname: string | null
	target_id: string
	user_avatar?: null | string
	user_id: string
}

export interface PostInfo {
	comments: number
	created_at: string
	description: null | string
	fullname: string | null
	group_id: string
	id: string
	likes: number
	title: string | null
	url: string | null
	user_avatar: null | string
	user_id: string | null
	liked?: boolean
	pinned?: boolean
}

export interface Group {
	cover?: null | string
	created_at?: string
	description: string | null
	discoverability: boolean
	id: string
	industry?: null
	location?: null
	logo?: null
	name: string | null
	rules?: null
	updated_at: string
	user_id: string | null
}

export interface CreateGroup {
	cover?: FileList | string | null
	description: string
	discoverability: boolean
	industry?: string | string[] | null
	location?: string | null
	logo?: FileList | string | null
	name: string
	rules?: string | null
}

export interface UpdateGroup {
	id: string
	cover?: FileList | string | null
	description?: string
	discoverability?: boolean
	industry?: string | string[] | null
	location?: string | null
	logo?: FileList | string | null
	name?: string
	rules?: string | null
}
