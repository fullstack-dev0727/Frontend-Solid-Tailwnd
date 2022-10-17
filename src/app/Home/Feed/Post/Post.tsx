import { PostInfo } from "@/api2/feed/types"
import { createSignal, Show, createEffect } from "solid-js"
import { likePostHandler, state } from "../state"
import { LikeIcon } from "@/ui/icons/LikeIcon"
import { PinIcon } from "@/ui/icons/PinIcon"
import { CommentIcon } from "@/ui/icons/CommentIcon"
import { formatLastModified } from "@/app/AIStudio/Panel/utils"
import { Comments } from "./Comments"
import { DeleteIcon, LoadingIcon, PencilIcon } from "@/assets/icons"
import { deletePostHandler, updatePostHandler } from "../handlers/post"
import { feedState } from "../handlers/fetch_feed"

export const Post = (props: {
	submit?: boolean
	cancel?: boolean
	onSubmit?: () => void
	onCancel?: () => void
	height?: string
	width?: string
	post: PostInfo
}) => {
	const {
		fullname,
		user_avatar,
		title,
		description,
		url,
		likes,
		group_id,
		created_at,
		comments,
		id,
		user_id,
	} = props.post

	const [commentsVisible, setCommentsVisible] = createSignal(false)
	const [editPost, setEditPost] = createSignal(false)
	// createEffect(() => {
	// 	console.log("state updated")
	// })
	return (
		<div
			class={`flex flex-col gap-[14px] z-[101] p-[16px] bg-[#FFFFFF] rounded-[24px]`}
		>
			<User
				post={props.post}
				onEditClick={() => setEditPost(!editPost())}
			/>
			<Show
				when={editPost()}
				fallback={
					<>
						<Body
							title={title}
							content={description}
						/>
						<Video src={url} />
					</>
				}
			>
				<EditPost post={props.post} />
			</Show>

			<div class="flex items-center justify-between">
				<Social
					likes={likes}
					comments={comments}
					isLiked={props.post.liked}
					onLike={() => {
						likePostHandler(props.post)
					}}
					onCommentClick={() => setCommentsVisible(!commentsVisible())}
				/>
				{/* ****************************** */}
				{/* Open AI Studio Button Disabled */}
				<Show when={false}>
					<Button
						height="44"
						width="44"
						text="Open AI Studio"
					/>
				</Show>
				{/* ****************************** */}
				{/* ****************************** */}
			</div>
			<Show when={commentsVisible()}>
				<Comments target_id={id} />
			</Show>
		</div>
	)
}

export const EditPost = (props: { post: PostInfo }) => {
	const [title, setTitle] = createSignal(props.post?.title)
	const [description, setDescription] = createSignal(props.post?.description)
	const [loading, setLoading] = createSignal(false)

	return (
		<>
			<div class={`flex flex-col gap-[4px]`}>
				{/* <h1 class="font-[600] text-[17px] leading-[22px]">{props.post.title}</h1> */}
				<textarea
					class="p-4 text-[15px] leading-[22.5px] rounded-[5px] border-solid border-[1px] border-[#bdbdbd] focus:border-black focus-visible:border-black"
					value={description()}
					onInput={(e: any) =>
						setDescription((e.target as HTMLInputElement).value)
					}
				/>
			</div>
			<div class="flex items-center content-center justify-center w-full h-[44px] self-center">
				<Show
					when={!loading() && state.user && state.groups_joined}
					fallback={
						<div
							class={`w-[70px] h-[38px] bg-[#187FE7] rounded-[24px] text-white text-[13px] font-[500] opacity-50 flex items-center justify-center content-center`}
						>
							<LoadingIcon class="w-5 h-5 text-white" />
						</div>
					}
				>
					<button
						disabled={description() === "" || loading()}
						class={`w-[70px] h-[38px] bg-[#187FE7] rounded-[24px] text-white text-[14px] font-[500] ${
							description() === "" ? "opacity-50" : "opacity-100"
						}`}
						onClick={async () => {
							setLoading(true)
							await updatePostHandler(props.post.id, title(), description())
							setLoading(false)
						}}
					>
						Update
					</button>
				</Show>
			</div>
			{props.post.url ? (
				<div class="">
					<img
						src={props.post.url}
						class="object-contain w-full h-full max-h-96 rounded-[24px]"
					/>
				</div>
			) : null}
		</>
	)
}

export const EditPostIcons = (props: {
	target_id: string
	onEditClick?: () => void
}) => {
	return (
		<div class="flex content-center items-center justify-end">
			<div
				class={"cursor-pointer"}
				onClick={props.onEditClick}
			>
				<PencilIcon
					size={18}
					class="w-[18px] h-[18px] hover:opacity-50"
				/>
			</div>
			<div
				class={"cursor-pointer ml-[12px]"}
				onClick={async () => {
					// DELETE POST
					await deletePostHandler(props.target_id)
				}}
			>
				<DeleteIcon
					size={18}
					color="red"
					class="w-[18px] h-[18px] hover:opacity-50"
				/>
			</div>
		</div>
	)
}

export const PinPost = (props: { post: PostInfo; onPinClick?: () => void }) => {
	return (
		<div
			class={
				"flex content-center items-center justify-end cursor-pointer hover:opacity-40 justify-end ml-[12px]"
			}
			onClick={async () => {
				// Pin Post
				updatePostHandler(
					props.post.id,
					props.post.title,
					props.post.description,
					!props.post.pinned
				)
			}}
		>
			<PinIcon active={props.post.pinned} />
		</div>
	)
}

export const User = (props: { post: PostInfo; onEditClick?: () => void }) => {
	const [date, setDate] = createSignal("")
	if (props.post.created_at) {
		setDate(formatLastModified(new Date(props.post.created_at)))
	}

	return (
		<div class="flex items-center content-center justify-center">
			<div class={`flex items-center content-center gap-[8px] w-full`}>
				<img
					src={
						props.post?.user_avatar
							? props.post.user_avatar
							: "/default-user-profile.svg"
					}
					class={`rounded-full w-[40px] h-[40px] object-cover`}
				/>
				<div class="font-[600] text-[15px] text-[#1D1D1F]  break-all">
					{props.post.fullname}
				</div>
				{props?.post.group_id &&
				state.group_names &&
				Object.keys(state.group_names)?.includes(props.post.group_id) ? (
					<>
						<div class="w-1 h-1 rounded-full bg-black opacity-60"></div>
						<div class="text-black opacity-60 font-medium text-sm">
							posted in
						</div>
						<div class="font-[600] text-[15px] text-[#1D1D1F] break-all">
							{state.group_names[props.post.group_id]}
						</div>
					</>
				) : null}
				{date() ? (
					<>
						<div class="w-1 h-1 rounded-full bg-black opacity-60"></div>
						<div class="text-black opacity-60 font-medium  text-sm">
							{date()}
						</div>
					</>
				) : null}
				<Show when={props.post?.user_id === state.user.user_id}>
					<div class="grow">
						<EditPostIcons
							target_id={props.post?.id}
							onEditClick={props.onEditClick}
						/>
					</div>
				</Show>
			</div>

			<Show
				when={
					props.post?.user_id === state.user.user_id &&
					state.groups_created?.includes(props.post?.group_id)
				}
			>
				<PinPost post={props.post} />
			</Show>
		</div>
	)
}

export const Video = (props: {
	src?: string
	height?: string
	width?: string
}) => {
	return (
		<>
			{props.src ? (
				<div class={`w-[${props.width}px] h-[${props.height}px] `}>
					<img
						src={props.src}
						class="object-contain w-full h-full max-h-96 rounded-[24px]"
					></img>
				</div>
			) : null}
		</>
	)
}

export const Body = (props: {
	height?: string
	width?: string
	title?: string
	content?: string
}) => {
	return (
		<div
			class={`w-[${props.width}px] h-[${props.height}px] flex flex-col gap-[4px]`}
		>
			<h1 class="font-[600] text-[17px] leading-[22px] break-all">
				{props.title}
			</h1>
			<p class="text-[15px] leading-[22.5px] break-all">{props.content}</p>
		</div>
	)
}

export const Social = (props: {
	height?: string
	width?: string
	likes?: string | number
	comments?: string | number
	isLiked: boolean
	onLike?: () => void
	onCommentClick?: () => void
}) => {
	return (
		<div
			class={`flex  items-center gap-[10px] w-[${props.width}px] h-[${props.height}px]`}
		>
			<div
				id="likes"
				class="flex  items-center gap-[4px]"
			>
				<div
					onClick={props.onLike}
					class={`cursor-pointer`}
				>
					<LikeIcon active={props.isLiked} />
				</div>
				<div class="text-[13px] font-[400]">{props.likes}</div>
			</div>
			<div
				id="comments"
				class="flex  items-center gap-[4px] cursor-pointer"
				onClick={props.onCommentClick}
			>
				<CommentIcon />
				<div class="text-[13px] font-[400]">{props.comments}</div>
			</div>
		</div>
	)
}

export const Button = (props: {
	height?: string
	width?: string
	text?: string
	onClick?: () => void
	color?: string
}) => {
	return (
		<div
			class={`w-[${props.width}px] h-[${props.height}px] rounded-[24px] bg-[${
				!props?.color ? "#0095F8" : props.color
			}] flex items-center justify-center cursor-pointer text-[15px] font-[500] text-[${
				!props?.color ? "#0095F8" : props.color
			}]`}
		>
			{props.text}
		</div>
	)
}

export const Avatar = (props: { src?: string[] }) => {
	const [src, setSrc] = createSignal(props.src)
	setSrc(["/avatar.png", "/avatar.png", "/avatar.png"])
	return (
		<div class=" flex ">
			{src().map((item, index) => {
				return (
					<img
						class={`w-12 h-12 rounded-full border-4 border-white ${
							index === 0 ? "" : "-ml-4"
						}`}
						src={item}
						alt=""
					/>
				)
			})}
		</div>
	)
}
