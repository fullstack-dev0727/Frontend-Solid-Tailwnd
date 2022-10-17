import { LoadingIcon } from "@/assets/icons"
import { createSignal, Show, For } from "solid-js"
import { state } from "../state"
import { postContentHandler } from "../handlers/new_post"
import { ImageIcon } from "@/ui/icons/ImageIcon"
import { feedState } from "../handlers/fetch_feed"
interface GroupDropdownOption {
	value: string
	text: string
}

export const NewPost = () => {
	const [title, setTitle] = createSignal("")
	const [description, setDescription] = createSignal("")
	const [files, setFiles] = createSignal(null)
	const [selectedGroupId, setSelectedGroupId] = createSignal("")
	const [loading, setLoading] = createSignal(false)

	const getGroupList = (): GroupDropdownOption[] => {
		let list: GroupDropdownOption[] = []
		if (feedState.selectedGroup) {
			const group = state.groups_joined?.find(
				(group) => feedState.selectedGroup === group.id
			)
			list.push({ value: group.id, text: group.name })
			setSelectedGroupId(group.id)
		} else {
			// list.push({ value: state.user.id, text: "My Profile" })
			state.groups_joined?.forEach((group) =>
				list.push({ value: group.id, text: group.name })
			)
			if (list.length > 0) setSelectedGroupId(list[0].value)
			else setSelectedGroupId(state.user.id)
		}
		return list
	}

	const clearState = () => {
		setTitle("")
		setDescription("")
		setFiles(null)
		setSelectedGroupId("")
		getGroupList()
		setLoading(false)
	}

	return (
		<div class="flex flex-col rounded-[24px] w-[600px] min-h-[140px] max-h-[600px] bg-[#FFFFFF] p-[16px] gap-[8px] shadow-[0px_4px_8px_rgba(0,0,0,0.08)] border-[1px] border-[#D2D2D7] h-auto mb-[16px]">
			<div class="flex w-full gap-[8px] items-center h-[48px]">
				<img
					src={
						state?.user?.picture
							? state?.user?.picture
							: "/default-user-profile.svg"
					}
					class="rounded-full h-[48px] w-[48px] object-contain"
				/>
				<input
					class=" flex flex-col text-[17px] leading-[14px] w-[512px] gap-[20px] outline-none"
					placeholder="What's new?"
					value={description()}
					onInput={(el) => {
						setDescription((el.target as HTMLInputElement).value)
					}}
					onKeyUp={async (ev) => {
						if (ev.code === "Enter" && description) {
							// setDescription("")
						}
					}}
				/>
			</div>
			<hr class="w-[512px] self-end" />
			<Show when={files()}>
				<div class="flex flex-col align-center justify-center content-center">
					<img
						class="object-contain w-full h-full max-h-96"
						src={URL.createObjectURL(files()[0])} // TODO: make slider if multiple file upload enabled
					/>
					<hr class="w-[512px] self-end mt-4" />
				</div>
			</Show>

			<div class="flex items-center justify-between w-[512px] h-[44px] self-end">
				<UploadAttachment onUpload={(files) => setFiles(files)} />
				<Show
					when={!loading() && state.user && state.groups_joined}
					fallback={
						<div
							class={`w-[85px] h-[44px] bg-[#187FE7] rounded-[24px] text-white text-[15px] font-[500] opacity-50 flex items-center justify-center content-center`}
						>
							<LoadingIcon class="w-5 h-5 text-white" />
						</div>
					}
				>
					<button
						disabled={description() === "" || loading()}
						class={`w-[85px] h-[44px] bg-[#187FE7] rounded-[24px] text-white text-[15px] font-[500] ${
							description() === "" ? "opacity-50" : "opacity-100"
						}`}
						onClick={async () => {
							if (description()) {
								setLoading(true)
								await postContentHandler({
									group_id: selectedGroupId()
										? selectedGroupId()
										: state.user?.id
										? state.user.id
										: "",
									description: description(),
									title: title(),
									files: files(),
								}).then(() => clearState())
							}
						}}
					>
						Post
					</button>
				</Show>
			</div>
			<div class="self-end">
				<Show when={state.user && state.groups_joined}>
					<GroupSelection
						list={
							getGroupList()?.length > 0
								? getGroupList()
								: [{ value: state.user.id, text: "My Profile" }]
						}
						onChange={(id) => setSelectedGroupId(id)}
					/>
				</Show>
			</div>
		</div>
	)
}

export const UploadAttachment = (props: {
	onUpload?: (files: FileList) => void
}) => {
	let uploadInput!: HTMLInputElement
	return (
		<div
			class="flex flex-col gap-[8px] cursor-pointer"
			onClick={() => uploadInput.click()}
		>
			<div class="flex gap-[8px] items-center">
				<ImageIcon />
			</div>
			<input
				class="hidden"
				type="file"
				accept="image/*"
				ref={uploadInput}
				onChange={async (ev) => {
					const files = (ev.target as HTMLInputElement).files
					console.log("Selected Files", files)
					if (!files || files?.length < 1 || !props?.onUpload) return
					props.onUpload(files)
				}}
			/>
		</div>
	)
}

export const GroupSelection = (props: {
	list: GroupDropdownOption[]
	disabled?: boolean
	onChange?: (selected: string) => void
}) => {
	return (
		<div class="flex flex-col">
			<div class="flex flex-row justify-end content-center items-center gap-[2px] text-[14px] mt-[12px]">
				<div class="mr-[8px] font-semibold">Post on: </div>
				<select
					disabled={props.disabled}
					onChange={(el) =>
						props.onChange?.((el.target as HTMLSelectElement).value)
					}
					class="bg-transparent cursor-pointer"
				>
					<For each={props.list}>
						{(val) => <option value={val.value}>{val.text}</option>}
					</For>
				</select>
			</div>
			{props?.list &&
			props?.list.length > 0 &&
			props?.list[0].text === "My Profile" ? (
				<>
					<div class="mt-[24px] text-sm font-semibold self-end">
						New Here?? Join or Create Groups to start -{">"}
					</div>
				</>
			) : null}
		</div>
	)
}
