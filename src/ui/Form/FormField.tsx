import { For, ParentProps } from "solid-js"

export interface FormFieldProps {
	label: string
	borderBottom?: boolean
	borderNone?: boolean
}

export const FormField = (props: ParentProps<FormFieldProps>) => {
	console.log("props", props)
	return (
		<div
			class={`flex h-[56px] w-[500px] bg-black/[0.06] border-black/[0.08] border-[1px] ${
				props.borderNone
					? ""
					: props.borderBottom
					? "rounded-bl-xl rounded-br-xl"
					: "rounded-tl-xl rounded-tr-xl"
			}`}
		>
			<div class="flex items-center basis-32 pl-8">
				<p class="font-semibold text-[15px]">{props.label}</p>
			</div>
			<div class="flex justify-center items-center">
				<div class="border-r-[1px] border-black/[0.08] h-[60%]"></div>
			</div>
			{props.children}
		</div>
	)
}

export const FormFieldInput = (
	props: FormFieldProps & {
		placeholder?: string
		disabled?: boolean
		onInput?: (input: string) => void
	}
) => {
	return (
		<FormField
			label={props.label}
			borderBottom={props.borderBottom}
			borderNone={props.borderNone}
		>
			<input
				class="p-3 text-[15px] leading-[18px] bg-transparent grow"
				disabled={props.disabled}
				placeholder={props.placeholder}
				onInput={(e) => props.onInput?.((e.target as HTMLInputElement).value)}
			></input>
		</FormField>
	)
}

export const FormFieldDropdown = (
	props: FormFieldProps & {
		disabled?: boolean
		options: Array<string>
		onChange?: (value: string) => void
	}
) => {
	return (
		<FormField
			label={props.label}
			borderBottom={props.borderBottom}
		>
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
					Select an option
				</option>
				<For each={props.options}>
					{(val) => <option value={val}>{val}</option>}
				</For>
			</select>
		</FormField>
	)
}

export const FormFieldGroup = (props: ParentProps<{}>) => {
	return <div>{props.children}</div>
}
