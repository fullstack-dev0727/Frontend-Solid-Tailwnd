import { video_instances } from "@/api2/ai_studio"
import {
	ContextBox,
	ContextBoxChildrenProducer,
} from "@/ui/ContextMenu/ContextBox"
import { EditMenu } from "@/ui/ContextMenu/EditMenu"
import { AIStudioCameraIcon } from "@/ui/icons/AIStudioCamera"
import { useNavigate } from "solid-app-router"
import { Accessor, createSignal } from "solid-js"
import { removeVideo, renameVideo, setCurrentVideo } from "./state"

export const VideoContextBox = (props: {
	name: string
	id: string
	left?: string
	top?: string
	renameLeft?: string
	renameTop?: string
	children: (
		name: Accessor<string>,
		...other: Parameters<ContextBoxChildrenProducer>
	) => void
}) => {
	const [name, setName] = createSignal(props.name)

	const changeName = () => {
		video_instances.update({ id: props.id, name: name() })
		renameVideo(props.id, name())
	}

	return (
		<ContextBox
			contextMenuProps={{ left: props.left, top: props.top }}
			items={[
				{
					name: "Rename",
					sub: {
						element: (hide) => (
							<EditMenu
								placeholder="New name"
								left={props.renameLeft}
								top={props.renameTop}
								value={name()}
								onChange={(text) => setName(text)}
								onHide={hide}
							/>
						),
						onHide: changeName,
					},
				},
				{
					name: "Delete",
					onClick: async () => {
						await video_instances.delete({ id: props.id })
						removeVideo(props.id)
					},
				},
			]}
		>
			{props.children.bind(undefined, name)}
		</ContextBox>
	)
}

const colors = ["#ABE88F"]

export const VideoInstanceDefaultIcon = (props: { active?: boolean }) => {
	const color = colors[Math.floor(Math.random() * colors.length)]
	return (
		<div
			class={`flex justify-center items-center w-[86px] h-[86px] pointer-events-none rounded-[8px] ${
				props.active ? "border-2 border-[#4EADF1]/[12]" : ""
			}`}
			style={{
				"background-color": color,
			}}
		>
			<AIStudioCameraIcon />
		</div>
	)
}

export const VideoInstance = (props: {
	active?: boolean
	name: string
	onClick?: () => void
	id: string
}) => {
	const navigate = useNavigate()

	return (
		<VideoContextBox
			name={props.name}
			id={props.id}
			left="10%"
			top="60px"
			renameLeft="10px"
			renameTop="-80px"
		>
			{(name, setVisibility) => {
				return (
					<div
						onclick={props.onClick}
						class={`flex flex-col cursor-pointer rounded-[8px] gap-1 justify-center items-center max-w-[110px]`}
						onContextMenu={(e) => {
							setVisibility(true, e)
							e.preventDefault()
						}}
						onDblClick={() => {
							setCurrentVideo(props.id)
							navigate("./editor/" + props.id)
						}}
					>
						<div class="p-[2px]">
							<VideoInstanceDefaultIcon active={props.active} />
						</div>

						<div
							class={`w-[110px] h-[48px] my-[2px] rounded-[8px] p-[4px] text-center bg-black/0 ${
								props.active ? "bg-black/[0.1]" : ""
							} group-hover:bg-black/[0.06]`}
							style={{ "overflow-wrap": "break-word" }}
						>
							<div
								class={`text-[13px] leading-[150%] font-[Inter] text-black/[0.6] font-medium line-clamp-2 ${
									props.active ? "text-black/[0.9]" : ""
								} group-hover:text-black/[0.9]`}
							>
								{name()}
							</div>
						</div>
					</div>
				)
			}}
		</VideoContextBox>
	)
}
