import { Component, For, onMount, useContext } from "solid-js"
import { AppTitle } from "@/ui/AppMenu/AppTitle"
import { MenuItemTitle } from "@/ui/AppMenu/MenuItemTitle"
import {
	addFolders,
	addVideos,
	addWorkspace,
	currentFolders,
	currentWorkspace,
	setCurrentFolder,
	setCurrentWorkspace,
	state,
} from "./state"
import { AppMenu } from "@/ui/AppMenu/AppMenu"
import { AppMenuBody, MenuItemSeperator } from "@/ui/AppMenu"
import { MenuItemGroup } from "@/ui/AppMenu/MenuItemGroup"
import { MenuItemList } from "@/ui/AppMenu/MenuItemList"
import { AppNavigator, AppNavigatorContext } from "@/ui/AppNavigator"
import { useRequest } from "@/helpers/useRequest"
import { folders, video_instances } from "@/api2/ai_studio"
import { workspaces } from "@/api2"
import { FolderInfo, VideoInfo } from "./types"
import { FolderMenu } from "./FolderMenu"
import { Spinner } from "@/ui/icons/Spinner"
import { useParams } from "solid-app-router"

export const Menu: Component = () => {
	const [getAllFolders, isLoading] = useRequest(folders.list)

	const ctx = useContext(AppNavigatorContext)
	const params = useParams()

	onMount(async () => {
		let selectedFolder = params.folder
		if (state.folders.length) {
			setCurrentFolder(state.currentFolder?state.currentFolder:state.folders[0].id)
			return ctx.navigate("folder", state.currentFolder?state.currentFolder:state.folders[0].id)
		}
		if (!state.workspaces.length) {
			const workspaceObj = (await workspaces.list({})).result[0]
			if (!workspaceObj) return
			addWorkspace(workspaceObj)
			setCurrentWorkspace(workspaceObj.workspace_id)
		}
		if (!state.currentWorkspace)
			setCurrentWorkspace(state.workspaces[0].workspace_id)
		const foldersObj = await getAllFolders({
			workspace_id: state.currentWorkspace,
		})
		if (
			selectedFolder &&
			!foldersObj.result.some((f) => selectedFolder === f.id)
		)
			selectedFolder = undefined
		addFolders(
			...foldersObj.result.sort(
				(a, b) =>
					new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
			)
		)
		const videos = await video_instances.list({
			workspace_id: state.currentWorkspace,
		})
		addVideos(
			...(videos.result as unknown as VideoInfo[])
				.map((v) => ({ ...v, created_at: new Date(v.created_at) }))
				.sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
		)
		setCurrentFolder(selectedFolder || foldersObj.result[0].id)
		ctx.navigate("folder", selectedFolder || foldersObj.result[0].id)
	})

	return (
		<AppMenu>
			<div>
				<AppTitle
					name={"AI Studio"}
					active={false}
					icon={"A"}
					theme={"black"}
					onClick={console.log}
				></AppTitle>
				<MenuItemSeperator />
			</div>

			<AppMenuBody>
				<AppNavigator
					noWelcome
					routes={(navigate, selected) => {
						return (
							<>
								<MenuItemGroup>
									<MenuItemTitle
										active={false}
										name={"Folders"}
										onClick={console.log}
										onClickPlus={async () => {
											const folder = await folders.create({
												name: "Untitled",
												workspace_id: currentWorkspace().workspace_id,
											})
											addFolders(folder.result)
										}}
									/>
									<MenuItemList>
										{!isLoading() ? (
											<For each={currentFolders()}>
												{(folder) => {
													return (
														<FolderMenu
															selected={selected === folder.id}
															folder={folder as FolderInfo}
															navigate={navigate}
														/>
													)
												}}
											</For>
										) : (
											<div class="flex justify-center items-center mt-[20%]">
												<Spinner />
											</div>
										)}
									</MenuItemList>
								</MenuItemGroup>
							</>
						)
					}}
				/>
			</AppMenuBody>
		</AppMenu>
	)
}
