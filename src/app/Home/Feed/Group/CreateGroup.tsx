import { LoadingIcon, ChevronLeftIcon } from "@/assets/icons"
import { createSignal, Show } from "solid-js"
import { createGroupHandler } from "../handlers/group"
import {
	TextInput,
	OptionInput,
	FileInput,
	//DropdownInput
} from "./components"

// const INDUSTRY_OPTION_LIST = [
// 	"eCommerce",
// 	"Marketing & Sales",
// 	"Software",
// 	"Real estate",
// 	"Automotive",
// 	"HR",
// 	"Finance",
// 	"Hospitality",
// 	"Politics",
// ]

// TODO: Missing fields:: Industry, Location, Rules
export const CreateGroup = (props: { onBack: () => void }) => {
	const [name, setName] = createSignal("")
	const [description, setDescription] = createSignal("")
	const [discoverability, setDiscoverability] = createSignal(true)
	// const [industry, setIndustry] = createSignal("")
	const [logo, setLogo] = createSignal(null)
	const [cover, setCover] = createSignal(null)
	const [loading, setLoading] = createSignal(false)
	const [error, setError] = createSignal("")
	const clearState = () => {
		setName("")
		setDescription("")
		setDiscoverability(true)
		// setIndustry("")
		setLogo(null)
		setCover(null)
		setError("")
		setLoading(false)
		props.onBack()
	}

	const onCreateGroup = async () => {
		setLoading(true)
		const success = await createGroupHandler({
			name: name(),
			description: description(),
			discoverability: discoverability(),
			logo: logo(),
			cover: cover(),
		})
		if (success) clearState()
		else setError("Something went wrong.")
		setLoading(false)
	}

	return (
		<div class={`flex flex-col mb-[4px]`}>
			<div class="flex flex-row items-center content-center">
				<div
					class="cursor-pointer"
					onClick={clearState}
				>
					<ChevronLeftIcon />
				</div>
				<div class="ml-[16px] font-semibold">Create Group</div>
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
				/>
				<FileInput
					label="Cover"
					onChange={(file) => setCover(file)}
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
					onClick={onCreateGroup}
				>
					Create
				</button>
			</Show>
			<Show when={error()}>
				<div class="px-5 pt-2 text-sm text-red-500">{error()}</div>
			</Show>
		</div>
	)
}
