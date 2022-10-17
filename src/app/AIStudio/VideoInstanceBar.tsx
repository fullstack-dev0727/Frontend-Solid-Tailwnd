import { ThreePointIconButton } from "@/ui/icons/ThreePointIconButton"
import { NewIconButton } from "@/ui/icons/NewIconButton"
import { folders, generated_page, PageData, VideoInstance, video_instances } from "@/api2/ai_studio";
import { addVideos, renameFolder as renameFolderState, removeFolder as removeFolderFromState, addPages } from "./state"
import { FolderIcon } from "@/ui/icons"
import { ContextBox } from "@/ui/ContextMenu/ContextBox"
import { EditMenu } from "@/ui/ContextMenu/EditMenu"
import { FolderInfo, VideoInfo } from "./types"
import { useAppNavigate } from "@/ui/AppNavigator"

export const VideoInstanceBar = (props: {
	folder: FolderInfo
	onViewToggle?: () => void,
	tableView?: boolean
}) => {
	const navigate = useAppNavigate();

	return (
		<div class={`flex h-12 w-full cursor-pointer p-[12px] bg-black/0 `}>
			<FolderIcon active={true} size={24} />
			<div class="text-[15px] font-[Inter] font-semibold w-full h-[18px] my-auto ml-[6px] mr-[12px] leading-[18px] overflow-hidden text-ellipsis whitespace-nowrap">
				{props.folder.name}
			</div>
			<div class="mr-[12px] ml-auto">
				<ContextBox items={[
					{
						name: !props.tableView ? "Table View" : "Image View",
						onClick: props.onViewToggle
					},
					{
						name: "Rename",
						sub: {
							element: (hide) => <EditMenu placeholder="New name" value={props.folder.name} onChange={(text) => renameFolderState(props.folder.id, text)} onHide={hide} />,
							onHide: () => folders.update({ id: props.folder.id, name: props.folder.name })
						}
					},
					{
						name: "Delete",
						onClick: () => {
							removeFolderFromState(props.folder.id);
							folders.delete({ id: props.folder.id });
							navigate();
						}
					}
				]}>
					{(setVisibility, visibility) => {
						return <ThreePointIconButton onClick={() => setVisibility(!visibility)} />
					}}
				</ContextBox>
			</div>
			<div class="mr-0 ml-auto" onClick={async () => {
				const video = await (await video_instances.create({ name: "Untitled", folder_id: props.folder.id })).result as unknown as VideoInfo;
				video.created_at = new Date(video.created_at);
				addVideos(video);
				const { page, widgets } = await (await generated_page.create({
					page: {
						name: video.name, video: video.id, video_instance: video.video_id, comments_enabled: false,
						default_template: false,
						emoji_enabled: false,
						vimeo_enabled: true
					}, widgets: []
				})).result as unknown as PageData;
				addPages({
					id: page.id, settings: {
						comments_enabled: false, default_template: false, emoji_enabled: false,
						vimeo_enabled: true, template_id: ""
					}, widgets: widgets.map((x, i) => { return { ...x, index: `${x.name}-${i}` }; }),
					video: page.video,video_instance: page.video_instance,
				});
			}}>
				<NewIconButton name="New" />
			</div>
		</div>
	)
}
