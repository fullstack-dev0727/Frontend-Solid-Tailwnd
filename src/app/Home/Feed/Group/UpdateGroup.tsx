import { Group, UpdateGroup as UpdateGroupInterface } from "@/api2/feed/types"
import { LoadingIcon, ChevronLeftIcon } from "@/assets/icons"
import { createSignal, Show } from "solid-js"
import { updateGroupHandler } from "../handlers/group"
import {
	TextInput,
	OptionInput,
	FileInput,
	//DropdownInput
} from "./components"

// TODO: Missing fields:: Industry, Location, Rules
export const UpdateGroup = (props: {
	currentGroup: Group
	onBack: () => void
}) => {
	const [name, setName] = createSignal(props.currentGroup.name)
	const [description, setDescription] = createSignal(
		props.currentGroup.description
	)
	const [discoverability, setDiscoverability] = createSignal(
		props.currentGroup.discoverability
	)
	const [currentLogo, setCurrentLogo] = createSignal(props.currentGroup.logo)
	const [currentCover, setCurrentCover] = createSignal(props.currentGroup.cover)
	const [logo, setLogo] = createSignal(null)
	const [cover, setCover] = createSignal(null)
	const [loading, setLoading] = createSignal(false)
	const [error, setError] = createSignal("")
	const clearState = () => {
		setName(props.currentGroup.name)
		setDescription(props.currentGroup.description)
		setDiscoverability(props.currentGroup.discoverability)
		// setIndustry("")
		setLogo(props.currentGroup.logo)
		setCover(props.currentGroup.cover)
		setError("")
		setLoading(false)
		props.onBack()
	}

	const onUpdateGroup = async () => {
		setLoading(true)

		let requestBody: UpdateGroupInterface = {
			id: props.currentGroup.id,
			name: name(),
			description: description(),
			discoverability: discoverability(),
		}
		if (logo()) requestBody.logo = logo()
		if (cover()) requestBody.cover = cover()

		const success = await updateGroupHandler(requestBody)
		if (success) clearState()
		else setError("Something went wrong.")
		setLoading(false)
	}

	return (
		<div class={`flex flex-col mb-[4px] w-full`}>
			<div class="flex flex-row items-center content-center">
				<div
					class="cursor-pointer"
					onClick={clearState}
				>
					<ChevronLeftIcon />
				</div>
				<div class="ml-[16px] font-semibold">Update Group</div>
			</div>
			<div class="mt-[24px]">
				<TextInput
					// disabled
					label="Group Name"
					type="text"
					placeholder="Group Name"
					value={name()}
					onChange={(val) => setName(val)}
				/>
				<TextInput
					// disabled
					type="textarea"
					label="Description"
					placeholder="Description"
					value={description()}
					onChange={(val) => setDescription(val)}
				/>
				<OptionInput
					// disabled
					label="Discoverability"
					checked={discoverability()}
					onChange={() => setDiscoverability(!discoverability())}
				/>
				{/* <DropdownInput
					// disabled
					label="Industry"
					options={INDUSTRY_OPTION_LIST}
					
					onChange={(val) => setIndustry(val)}
				/> */}
				<FileInput
					label="Logo"
					onChange={(file) => setLogo(file)}
					currentFile={currentLogo()}
				/>
				<FileInput
					label="Cover"
					onChange={(file) => setCover(file)}
					currentFile={currentCover()}
				/>
			</div>
			<Show
				when={!loading()}
				fallback={
					<div
						class={`self-center w-[85px] h-[44px] bg-[#187FE7] rounded-[24px] text-white text-[15px] font-[500] opacity-50 flex items-center justify-center content-center`}
					>
						<LoadingIcon class="w-5 h-5 text-white" />
					</div>
				}
			>
				<button
					disabled={loading() || !name()}
					class={`self-center w-[85px] h-[44px] bg-[#187FE7] rounded-[24px] text-white text-[15px] font-[500] ${
						loading() || !name() ? "opacity-50" : "opacity-100"
					}`}
					onClick={onUpdateGroup}
				>
					Update
				</button>
			</Show>
			<Show when={error()}>
				<div class="px-5 pt-2 text-sm text-red-500">{error()}</div>
			</Show>
		</div>
	)
}
