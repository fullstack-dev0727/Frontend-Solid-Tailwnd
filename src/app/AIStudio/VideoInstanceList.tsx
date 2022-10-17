import {
	DataTable,
	DataTableHeaderResizeInfo,
	defaultDateSortingStrategy,
	defaultStringSortingStartegy,
} from "@/ui/DataTable"
import { DataRowWrapper, StyledRowField } from "@/ui/DataTable/dataRow"
import { Spinner } from "@/ui/icons/Spinner"
import { Scrollable } from "@/ui/Scrollable"
import { createSignal, For } from "solid-js"
import {
	currentFolder,
	getCurrentVideo,
	getCurrentVideos,
	setCurrentVideo,
	state,
} from "./state"
import { VideoInfo } from "./types"
import { VideoContextBox, VideoInstance } from "./VideoInstance"
import { VideoInstanceBar } from "./VideoInstanceBar"

export const VideoTable = () => {
	return (
		<Scrollable>
			<div class="h-[calc(100vh-65px)]">
				<DataTable<VideoInfo>
					data={getCurrentVideos()}
					headers={[
						{
							name: "Name",
							sort: defaultStringSortingStartegy("name"),
						},
						{
							name: "Created at",
							sort: defaultDateSortingStrategy("created_at"),
							noResize: true,
						},
					]}
					resolveData={(video, resize) => (
						<TableRow
							video={video}
							resize={resize}
						/>
					)}
					disableMultiSelect={true}
					onSelect={(selected) =>
						selected[0] && setCurrentVideo(selected[0].id)
					}
					selected={state.currentVideo ? [getCurrentVideo()] : []}
				/>
			</div>
		</Scrollable>
	)
}

export const VideoInstanceList = () => {
	const [isTableView, setTableView] = createSignal(false)

	return (
		<div>
			{(console.log(currentFolder()), "")}
			{currentFolder() ? (
				<>
					<VideoInstanceBar
						folder={currentFolder()}
						onViewToggle={() => setTableView(!isTableView())}
						tableView={isTableView()}
					/>
					<div class="bg-black/[0.08] w-full h-[1px] rounded-xl"></div>
					{isTableView() ? (
						<VideoTable />
					) : (
						<Scrollable>
							<div class="p-[12px] h-[calc(100vh_-_60px)] flex select-none flex-wrap gap-2 items-start justify-start content-start">
								<For each={getCurrentVideos()}>
									{(video) => {
										return (
											<VideoInstance
												name={video.name}
												id={video.id}
												active={getCurrentVideo()?.id === video.id}
												onClick={() => {
													if (getCurrentVideo()?.id === video.id)
														setCurrentVideo()
													else setCurrentVideo(video.id)
												}}
											/>
										)
									}}
								</For>
							</div>
						</Scrollable>
					)}
				</>
			) : (
				<div class="flex justify-center items-center h-screen">
					<Spinner
						height="h-12"
						width="w-12"
					/>
				</div>
			)}
		</div>
	)
}

const TableRow = (props: {
	video: VideoInfo
	resize: DataTableHeaderResizeInfo
}) => {
	return (
		<VideoContextBox
			name={props.video.name}
			id={props.video.id}
			top="10px"
			left="10px"
		>
			{(name, setVisibility) => {
				return (
					<div
						onContextMenu={(e) => {
							e.preventDefault()
							setVisibility(true, e)
						}}
					>
						<DataRowWrapper>
							<StyledRowField resize={props.resize[0]}>{name()}</StyledRowField>
							<StyledRowField resize={props.resize[1]}>
								{props.video.created_at.toUTCString()}
							</StyledRowField>
						</DataRowWrapper>
					</div>
				)
			}}
		</VideoContextBox>
	)
}
