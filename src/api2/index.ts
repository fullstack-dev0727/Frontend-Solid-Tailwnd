import { repo } from "./repo"
import { CreateWorkspace, UpdateWorkspace, Workspace } from "./types"

export * as auth from "./auth"
export * as user from "./user"
export * as files from "./files"
export * from "./types"
export * from "./transcript"
export * from "./pauses"
export * from "./normalize"

export const workspaces = repo<
	CreateWorkspace,
	{ id: string },
	{},
	UpdateWorkspace,
	{ id: string },
	Workspace
>("api/workspace", "https://workspace.dev.bhuman.ai/")
