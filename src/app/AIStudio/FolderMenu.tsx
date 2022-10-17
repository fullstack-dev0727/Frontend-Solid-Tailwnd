import { folders, video_instances } from "@/api2/ai_studio"
import { MenuItem } from "@/ui/AppMenu"
import { AppNavigatorFn } from "@/ui/AppNavigator"
import { ContextBox, ItemSpec } from "@/ui/ContextMenu/ContextBox"
import { EditMenu } from "@/ui/ContextMenu/EditMenu"
import { NewIconButton } from "@/ui/IconButtons/new"
import SettingsIconButton from "@/ui/IconButtons/settings"
import { FolderIcon } from "@/ui/icons"
import { createMemo } from "solid-js"
import {
	addVideos,
	removeFolder as removeFolderFromState,
	renameFolder as renameFolderState,
	setCurrentFolder,
	state,
} from "./state"
import { FolderInfo, VideoInfo } from "./types"

export const FolderMenu = (props: {
	folder: FolderInfo
	selected?: boolean
	navigate: AppNavigatorFn
}) => {
	const items = createMemo<ItemSpec[]>(() => {
		return [
			{
				name: "Rename",
				sub: {
					element: (hide) => (
						<EditMenu
							placeholder="New name"
							value={props.folder.name}
							onChange={(text) => renameFolderState(props.folder.id, text)}
							onHide={hide}
						/>
					),
					onHide: () =>
						folders.update({ id: props.folder.id, name: props.folder.name }),
				},
			},
			{
				name: state.videos.filter((v) => v.folder_id === props.folder.id).length
					? "Cannot Delete"
					: "Delete",
				onClick: async () => {
					const { code } = await folders.delete({ id: props.folder.id })
					if (code !== 200) return
					removeFolderFromState(props.folder.id)
					if (state.currentFolder === props.folder.id) props.navigate()
				},
			},
		]
	})

	return (
		<ContextBox items={items()}>
			{(setContextMenu, isActive) => (
				<MenuItem
					name={props.folder.name}
					icon={() => (
						<FolderIcon
							active={props.selected}
							size={16}
						/>
					)}
					active={props.selected}
					onClick={() => {
						setCurrentFolder(props.folder.id)
						props.navigate("folder", props.folder.id)
					}}
				>
					<SettingsIconButton
						onClick={() => {
							setContextMenu(!isActive)
						}}
					/>
					<NewIconButton
						onClick={async () => {
							const file = (
								await video_instances.create({
									name: "Untitled",
									folder_id: props.folder.id,
								})
							).result as unknown as VideoInfo
							file.created_at = new Date(file.created_at)
							addVideos(file)
						}}
					/>
				</MenuItem>
			)}
		</ContextBox>
	)
}
