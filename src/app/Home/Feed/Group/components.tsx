import { For, createSignal, Show } from "solid-js"
import { ImageIcon } from "@/ui/icons/ImageIcon"

export const TextInput = (props: {
	onChange?: (val: string) => void
	placeholder?: string
	disabled?: boolean
	value: string
	label?: string
	class?: string
	type?: string
}) => {
	const _props = {
		class: "px-[3px] text-[14px] bg-transparent grow py-2",
		disabled: props.disabled,
		placeholder: props.placeholder,
		value: props.value,
		onInput: (e: any) => props.onChange?.((e.target as HTMLInputElement).value),
	}
	return (
		<div class="flex flex-row items-center content-center justify-between w-full mb-[24px]">
			{props?.label ? <Label label={props.label} /> : null}
			{props?.type === "textarea" ? (
				<textarea
					{..._props}
					maxLength={150}
				/>
			) : (
				<input
					{..._props}
					type="text"
					maxLength={50}
				/>
			)}
		</div>
	)
}
export const OptionInput = (props: {
	onChange: () => void
	checked?: boolean
	label: string
	disabled?: boolean
	class?: string
}) => {
	return (
		<div class="flex flex-row content-center items-center  mb-[24px]">
			{props?.label ? <Label label={props.label} /> : null}
			<label
				for={props.label}
				class="flex items-center cursor-pointer relative"
			>
				<input
					type="checkbox"
					id={props.label}
					class="sr-only"
					checked={props.checked}
					onchange={props.onChange}
				/>
				<div
					class="toggle-bg border-2 border-black h-6 w-11 rounded-full"
					classList={{
						"bg-gray-700": props.checked,
						"bg-white": !props.checked,
						"opacity-40": !props.checked,
					}}
				></div>
			</label>
		</div>
	)
}
export const DropdownInput = (props: {
	onChange?: (val: string) => void
	label?: string
	options: string[]
	disabled?: boolean
	class?: string
}) => {
	return (
		<div class="flex flex-row content-center items-center justify-between w-full mb-[24px]">
			{props?.label ? <Label label={props.label} /> : null}
			<select
				disabled={props.disabled}
				onChange={(el) =>
					props.onChange?.((el.target as HTMLSelectElement).value)
				}
				class="p-3 text-[15px] leading-[18px] bg-transparent grow border-none"
			>
				<option
					value="---"
					disabled
					selected
				>
					Select an Industry
				</option>
				<For each={props.options}>
					{(val) => <option value={val}>{val}</option>}
				</For>
			</select>
		</div>
	)
}
export const FileInput = (props: {
	onChange: (file: Blob | FileList) => void
	label?: string
	class?: string
	currentFile?: string
}) => {
	const [image, setImage] = createSignal(null)
	let uploadImage!: HTMLInputElement
	console.log("currentFile", props.currentFile)
	return (
		<div class="mb-[24px]">
			<div
				class="flex flex-row content-center items-center  w-full"
				classList={{
					"mb-[16px]": image(),
				}}
			>
				{props?.label ? <Label label={props.label} /> : null}
				<div
					class="flex gap-[8px] items-center cursor-pointer self-center"
					onClick={() => uploadImage.click()}
				>
					<div
						class={`flex flex-row items-center contents-center justify-center  border-2 border-black opacity-50 bg-transparent rounded-[4px] text-black text-[15px] font-[500]
								hover:opacity-80 gap-[4px] px-2`}
					>
						<ImageIcon />
						<div class="">{image() ? "Change" : "Upload"}</div>
					</div>
					<input
						id={`${props?.label ? props?.label : "group_img"}`}
						class="hidden"
						type="file"
						ref={uploadImage}
						// class="p-3 text-[15px] leading-[18px] bg-transparent grow"
						accept="image/*"
						onChange={async (ev) => {
							const file = (ev.target as HTMLInputElement).files
							console.log("Selected File", file)
							if (!file || !props?.onChange) return
							props.onChange(file)
							setImage(file[0])
						}}
					/>
				</div>
			</div>
			<Show when={image() || props.currentFile}>
				<div class="flex flex-col align-center justify-center content-center">
					<img
						class="object-contain w-full h-full max-h-72"
						classList={{
							"py-6": !!props.currentFile,
						}}
						src={image() ? URL.createObjectURL(image()) : props.currentFile}
					/>
				</div>
			</Show>
		</div>
	)
}

const Label = (props: { label: string; class?: string }) => {
	return (
		<div class="text-[14px] font-semibold mr-10 w-3/12">{props.label}: </div>
	)
}
