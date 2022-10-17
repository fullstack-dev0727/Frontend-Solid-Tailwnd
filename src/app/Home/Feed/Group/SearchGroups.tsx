import { Group } from "@/api2/feed/types"
import { LoadingIcon } from "@/assets/icons"
import { createEffect, createSignal, For, Show } from "solid-js"
import { state } from "../state"
import { CheckIcon, PlusIcon } from "@/assets/icons"
import { joinGroupHandler, leaveGroupHandler } from "../handlers/group"
import { CreateGroup } from "./CreateGroup"
import { getArrayItemWithKeyAndValue } from "../../../AIStudio/Editor/utils"
import { feedState, setFeedState, fetchFeed } from "../handlers/fetch_feed"

export const SearchGroups = () => {
	const [createVisible, setCreateVisible] = createSignal(false)
	const [showJoinedGroups, setShowJoinedGroups] = createSignal(true)
	const [filteredList, setFilteredList] = createSignal(
		state.groups_discoverable
	)
	const filterGroups = (): any[] => {
		let filtered: Group[] = []
		state.groups_discoverable.forEach((group) => {
			if (!getArrayItemWithKeyAndValue(state.groups_joined, "id", group.id))
				filtered.push(group)
		})
		return filtered
	}
	createEffect(() => {
		if (!showJoinedGroups()) {
			setFilteredList(filterGroups())
		} else setFilteredList(state.groups_discoverable)
	})
	return (
		<div
			class="flex flex-col rounded-[24px] w-[30%] h-auto bg-[#FFFFFF] p-[16px] gap-[8px] shadow-[0px_4px_8px_rgba(0,0,0,0.08)] border-[1px] border-[#D2D2D7]  mb-[16px] mr-[3vw]"
			// w-[350px]
			// min-w-[350px] max-w-[350px]
			// mr-[7vw]
			classList={{
				"h-[400px]": state.loading || !state.groups_discoverable,
				"w-[45%]": createVisible(),
			}}
		>
			<Show
				when={!createVisible()}
				fallback={
					<CreateGroup
						onBack={() => {
							setCreateVisible(false)
						}}
					/>
				}
			>
				<>
					<div class="mb-[20px] flex items-center content-center justify-between">
						<div class="font-semibold">Search Public Groups</div>
						<span
							class="font-[300] text-[15px] text-[#187FE7] cursor-pointer"
							onClick={() => {
								setCreateVisible(true)
							}}
						>
							Create
						</span>
					</div>
					<div class="flex flex-row content-center items-center mb-[16px]">
						<div class="text-black font-medium text-[15px]">Joined </div>
						<label
							for={"joined"}
							class="flex items-center cursor-pointer relative ml-4"
						>
							<input
								type="checkbox"
								id={"joined"}
								class="sr-only"
								checked={showJoinedGroups()}
								onchange={() => setShowJoinedGroups(!showJoinedGroups())}
								disabled={state.loading || !state.groups_discoverable}
							/>
							<div
								class="toggle-bg border-2 border-black h-6 w-11 rounded-full"
								classList={{
									"bg-gray-700": showJoinedGroups(),
									"bg-white": !showJoinedGroups(),
									"opacity-40": !showJoinedGroups(),
								}}
							></div>
						</label>
					</div>
					<Show
						when={!state.loading && state.groups_discoverable}
						fallback={
							<div
								class={`h-screen flex items-center justify-center content-center`}
							>
								<LoadingIcon class="w-5 h-5" />
							</div>
						}
					>
						<For
							each={
								showJoinedGroups() ? state.groups_discoverable : filteredList()
							}
						>
							{(group) => <GroupItem group={group} />}
						</For>
					</Show>
				</>
			</Show>
		</div>
	)
}

export const GroupItem = (props: { group: Group }) => {
	const { id, logo, name, description } = props.group
	return (
		<div class="flex justify-start content-center items-start mb-[12px]">
			<GroupAvatar
				src={logo}
				name={name}
				id={id}
			/>
			<div class="ml-[12px]">
				<GroupInfo
					name={name}
					description={description}
				/>
				<JoinButton
					id={id}
					joined={!!state.groups_joined.find((group) => group.id === id)}
				/>
			</div>
		</div>
	)
}

export const GroupAvatar = (props: {
	src: string
	name?: string
	id: string
}) => {
	return (
		<div
			class={`flex items-center content-center justify-center gap-[8px] w-[40px] h-[40px] rounded-full cursor-pointer`}
			classList={{
				"bg-black": !props.src ? true : false,
			}}
			onClick={() => {
				// fetchFeed(props.id)
			}}
		>
			<Show
				when={props.src}
				fallback={
					<p class="font-semibold text-white text-[23px] text-center align-middle leading-[80px]">
						{props.name[0]}
					</p>
				}
			>
				<img
					src={props.src}
					class={`w-[40px] h-[40px] object-contain`}
				/>
			</Show>
		</div>
	)
}

export const GroupInfo = (props: { name: string; description: string }) => {
	return (
		<div class={`flex flex-col mb-[4px] max-w-[230px]`}>
			<h1 class="font-[500] text-[16px] leading-[22px] truncate">
				{props.name}
			</h1>
			<p class="text-[12px] leading-[22.5px] truncate">{props.description}</p>
		</div>
	)
}

export const JoinButton = (props: { id: string; joined?: boolean }) => {
	const [loading, setLoading] = createSignal(false)
	const [joined, setJoined] = createSignal(props.joined)

	const onUpdate = (success: boolean) => {
		if (success) setJoined(!joined())
	}

	const onClick = async () => {
		setLoading(true)
		if (joined())
			await leaveGroupHandler(props.id).then((success) => onUpdate(success))
		else await joinGroupHandler(props.id).then((success) => onUpdate(success))
		setLoading(false)
	}
	return (
		<button
			disabled={loading()}
			class={`flex flex-row items-center contents-center w-[110px] h-[30px] border-2 border-black opacity-50 bg-transparent rounded-[24px] text-black text-[15px] font-[500] hover:opacity-80 pl-[12px]`}
			classList={{
				"w-[100px]": !joined(),
				"opacity-80": joined(),
			}}
			onClick={onClick}
		>
			{loading() ? (
				<LoadingIcon class="w-5 h-5" />
			) : joined() ? (
				<CheckIcon size={12} />
			) : (
				<PlusIcon size={12} />
			)}
			<div
				class="ml-[6px]"
				classList={{
					"ml-[9px]": !joined(),
				}}
			>
				{joined() ? "Joined" : "Join"}
			</div>
		</button>
	)
}
