import { createSignal, For, Show, onMount } from "solid-js"
import { state, updatePostRender } from "../state"
import { formatLastModified } from "@/app/AIStudio/Panel/utils"
import { Comment as CommentInterface } from "@/api2/feed/types"
import { LoadingIcon, DeleteIcon } from "@/assets/icons"
import { addComment } from "../handlers/comment"
import { getComment } from "@/api2/feed/comment"

const SIZE = 5
export const Comments = (props: { target_id: string }) => {
	const [comments, setComments] = createSignal([])
	const [page, setPage] = createSignal(0)
	const [endOfList, setEndOfList] = createSignal(false)

	const fetchComments = async () => {
		await getComment(page(), SIZE, props.target_id).then((resp) => {
			if (resp.code === 200) {
				if (resp.result.length > 0) {
					const temp = comments().concat(resp.result)
					setComments(temp)
				} else setEndOfList(true)
			}
		})
	}

	onMount(async () => {
		await fetchComments()
	})
	return (
		<div class={`gap-[10px] px-2`}>
			<NewComment
				target_id={props.target_id}
				onSuccess={(com: CommentInterface) => {
					let temp = JSON.parse(JSON.stringify(comments()))
					temp.unshift(com)
					setComments(temp)
					// updatePostRender(props.target_id, [
					// 	{
					// 		key: "comments",
					// 		value:
					// 			state.FEED.find((post) => post.id === props.target_id)
					// 				.comments + 1,
					// 	},
					// ])
				}}
			/>
			<div>
				<For each={comments()}>
					{(comment) => <Comment commentObj={comment} />}
				</For>
				<Show when={comments().length > 0 && !endOfList()}>
					<div
						onClick={() => {
							setPage(page() + 1)
							fetchComments()
						}}
						class="cursor-pointer text-sm text-[#187FE7] font-medium hover:opacity-70 mt-[16px]"
					>
						Load more
					</div>
				</Show>
			</div>
		</div>
	)
}

export const NewComment = (props: {
	target_id: string
	disabled?: boolean
	onSuccess: (c: CommentInterface) => void
}) => {
	const [input, setInput] = createSignal("")
	const [error, setError] = createSignal("")
	const [loading, setLoading] = createSignal(false)

	return (
		<div class={`w-full`}>
			<div class={`flex items-center gap-[10px] w-full`}>
				<img
					src={
						state.user?.picture
							? state.user?.picture
							: "/default-user-profile.svg"
					}
					class={`rounded-full w-[35px] h-[35px] object-cover self-start`}
				/>
				<div class="w-full">
					<textarea
						class={
							"px-[13px] text-[14px] bg-transparent grow py-2 w-full rounded-[5px] border-solid border-[1px] border-[#bdbdbd] focus:border-black focus-visible:border-black"
						}
						disabled={props.disabled}
						placeholder={"Share your thoughts..."}
						value={input()}
						onInput={(e: any) => setInput((e.target as HTMLInputElement).value)}
					/>
				</div>
				<Show
					when={!loading()}
					fallback={
						<div
							class={`w-[65px] h-[34px] bg-[#187FE7] rounded-[24px] text-white text-[15px] font-[500] opacity-50 flex items-center justify-center content-center self-start`}
						>
							<LoadingIcon class="w-4 h-4 text-white" />
						</div>
					}
				>
					<button
						disabled={input() === "" || loading()}
						class={`w-[65px] h-[34px] bg-[#187FE7] rounded-[24px] text-white text-[13px] font-[500] self-start ${
							input() === "" ? "opacity-50" : "opacity-100"
						}`}
						onClick={async () => {
							if (input()) {
								setLoading(true)
								addComment(props.target_id, input()).then((resp) => {
									if (resp.code === 200) {
										setError("")
										setInput("")
										setLoading(false)
										props.onSuccess(resp.result)
									} else setError("Something went wrong.")
								})
							}
						}}
					>
						Share
					</button>
				</Show>
			</div>
			<Show when={error()}>
				<div class="px-5 pt-2 text-sm text-red-500">{error()}</div>
			</Show>
		</div>
	)
}

export const Comment = (props: { commentObj?: CommentInterface }) => {
	const { comment, fullname, user_avatar, user_id, target_id, created_at } =
		props.commentObj
	const [date, setDate] = createSignal("")
	if (created_at) setDate(formatLastModified(new Date(created_at)))

	return (
		<div class={`flex items-center content-center gap-[12px] mt-[16px] w-full`}>
			<div class="flex flex-row items-center content-center gap-[8px] w-full">
				<img
					src={user_avatar ? user_avatar : "/default-user-profile.svg"}
					class={`rounded-full w-[35px] h-[35px] object-cover self-start`}
				/>
				<div class="rounded-[10px] gap-[8px]  w-full">
					{/* COMMENT VIEW border border-[#f2f2f2] bg-[#f2f2f2] p-2 */}
					<div class="flex flex-row items-center content-center gap-[8px]">
						<div class="font-[600] text-[14px] text-[#1D1D1F] break-all">
							{fullname}
						</div>
						{date() ? (
							<>
								<div class="w-1 h-1 rounded-full bg-black opacity-60"></div>
								<div class="text-black opacity-60 font-medium  text-sm">
									{date().includes("-") ? "0s" : date()}
								</div>
							</>
						) : null}
					</div>
					<div class="font-[500] text-[13px] text-[#1D1D1F] mt-[4px] break-all">
						{comment}
					</div>
				</div>
				{/* ********************************************* */}
				{/* Comment out if delete comment feature enabled */}
				<Show
					when={false}
					//</div>when={state.user?.user_id === user_id}
				>
					<div
						class="self-start"
						onClick={() => {
							// DELETE COMMENT
						}}
					>
						<DeleteIcon
							color="red"
							size={16}
							class="opacity-50 hover:opacity-80 cursor-pointer"
						/>
					</div>
				</Show>
				{/* ********************************************* */}
				{/* ********************************************* */}
			</div>
		</div>
	)
}
