import { createSignal, For, onMount, Show } from "solid-js"
import { Post } from "./Post/Post"
import { NewPost } from "./Post/NewPost"
import { state, setupFeed } from "./state"
import { LoadingIcon } from "@/assets/icons"
import { SearchGroups } from "./Group/SearchGroups"
import { feedState } from "./handlers/fetch_feed"
import { Group } from "@/api2/feed/types"
import { DeleteIcon, PencilIcon } from "@/assets/icons"
import { deleteGroupHandler } from "./handlers/group"
import { UpdateGroup } from "./Group/UpdateGroup"

export const Feed = () => {
	onMount(async () => {
		if (!state.initiated) await setupFeed()
	})

	return (
		<div class="flex flex-row justify-between items-start content-center w-full pt-[47px] gap-[16px] p-2 pb-[47px]">
			<div
				class="flex flex-col items-center justify-center content-center w-full"
				// ml-[12vw]
				classList={
					{
						// "ml-[4vw]": !!feedState.selectedGroup,
						// "ml-[0px]": !!feedState.selectedGroup,
					}
				}
			>
				<Show when={feedState.selectedGroup}>
					<GroupProfile
						group={state.groups_joined.find(
							(group) => group.id === feedState.selectedGroup
						)}
					/>
				</Show>
				<NewPost />
				<Show
					when={!feedState.feedLoading}
					fallback={
						<div
							class={`flex items-center justify-center content-center mt-[50px]`}
							classList={
								{
									// "h-5/6": !!feedState.selectedGroup,
								}
							}
						>
							<LoadingIcon class="w-5 h-5" />
						</div>
					}
				>
					<div>
						<Posts />
					</div>
				</Show>
			</div>
			<SearchGroups />
		</div>
	)
}
export const Posts = () => {
	return (
		<div>
			<For
				each={state.FEED}
				fallback={
					<div
						class={`mt-[68px] flex items-center justify-center content-center`}
					>
						NO POSTS
					</div>
				}
			>
				{(post) => (
					<div class="flex flex-col bg-[#FFFFFF] w-[600px] shadow-[0px_4px_8px_rgba(0,0,0,0.08)] border-[1px] border-[#D2D2D7] rounded-[24px] mb-[16px]">
						<Post post={post} />
					</div>
				)}
			</For>
			<Show when={feedState.pageLoading}>
				<div
					class={`flex items-center justify-center content-center my-[50px]`}
				>
					<LoadingIcon class="w-5 h-5" />
				</div>
			</Show>
		</div>
	)
}

export const GroupProfile = (props: { group: Group }) => {
	const [editGroup, setEditGroup] = createSignal(false)

	const IMG_PROPS =
		"w-[150px] h-[150px] rounded-full border-[1px] border-[#D2D2D7]"
	return (
		<div
			classList={
				{
					// "h-[350px]": !!props.group.cover,
					// "h-full p-8 w-full grow": editGroup(),
					// "justify-between":
					// 	state.user?.user_id === props.group?.user_id && !editGroup(),
					// "justify-end": !(
					// 	state.user?.user_id === props.group?.user_id && !editGroup()
					// ),
				}
			}
			class={`${editGroup() ? "h-full p-8 grow" : "min-h-[250px]"} ${
				state.user?.user_id === props.group?.user_id && !editGroup()
					? "justify-between"
					: "justify-end"
			} flex flex-col  p-[4px] bg-[#FFFFFF] w-full  shadow-[0px_0px_0px_rgba(0,0,0,0.08)] border-[1px] border-[#D2D2D7] rounded-[15px] mb-[50px]`}
		>
			{/* w-[900px] */}
			<Show when={state.user?.user_id === props.group?.user_id && !editGroup()}>
				<div class="self-end p-4 bg-[#FFFFFF] shadow-[0px_0px_0px_rgba(0,0,0,0.08)] border-[1px] border-[#D2D2D7] rounded-[15px]">
					<EditGroup
						group_id={props?.group?.id}
						onEditClick={() => setEditGroup(true)}
					/>
				</div>
			</Show>

			<Show
				when={!editGroup()}
				fallback={
					<UpdateGroup
						currentGroup={props.group}
						onBack={() => setEditGroup(false)}
					/>
				}
			>
				<div class="flex p-[4px] py-[12px] flex-row self-end z-[100] w-full self-end">
					<Show
						when={props?.group?.logo}
						fallback={
							<p
								class={`${IMG_PROPS} text-[40px] 
					flex items-center content-center justify-center 
					font-semibold text-white text-center align-middle bg-black/[0.8]`}
							>
								{props.group?.name[0]}
							</p>
						}
					>
						<img
							src={props?.group?.logo}
							class={`${IMG_PROPS} object-contain bg-white `}
						/>
					</Show>
					<div class="w-full max-w-[700px] flex flex-col items-start content-center justify-center ml-[24px] break-words">
						<div class="flex flex-row items-center content-center justify-between w-full mb-[16px]">
							<div class="font-[600] text-[20px] text-[#1D1D1F]">
								{props?.group?.name}
							</div>
							{/* <Show when={state.user?.user_id === props.group?.user_id}>
								<EditGroup
									group_id={props?.group?.id}
									onEditClick={() => setEditGroup(true)}
								/>
							</Show> */}
						</div>
						<div class="font-[400] text-[14px] text-[#1D1D1F] break-all">
							{props?.group?.description}
						</div>
					</div>
				</div>
			</Show>

			{/* <Show when={props.group.cover}>
				<div class="absolute w-[890px] h-[300px] opacity-50">
					<img
						src={props.group.cover}
						class="object-fill w-full h-full rounded-lg"
					/>
				</div>
			</Show> */}
		</div>
	)
}

export const EditGroup = (props: {
	group_id: string
	onEditClick: () => void
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
				class={"cursor-pointer ml-[16px]"}
				onClick={async () => {
					// DELETE GROUP
					await deleteGroupHandler(props.group_id)
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
