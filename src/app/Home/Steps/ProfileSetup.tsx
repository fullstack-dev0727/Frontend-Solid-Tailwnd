import {
	FormFieldDropdown,
	FormFieldGroup,
	FormFieldInput,
} from "@/ui/Form/FormField"
import { StepMenuProps } from "@/ui/StepMenu"
import { createSignal } from "solid-js"

export const ProfileSetup = (props: StepMenuProps & { isLoading: boolean }) => {
	const [firstLetter, setFirstLetter] = createSignal("B")
	const [profilePic, setProfilePic] = createSignal<File>()
	return (
		<div class="flex flex-col justify-center items-center gap-6 font-[Inter]">
			<div class="flex flex-col justify-center gap-2 items-center">
				<div
					class={`w-[80px] h-[80px] rounded-[48px] ${
						profilePic() ? "" : "bg-black"
					}`}
				>
					{profilePic() ? (
						<img
							src={URL.createObjectURL(profilePic())}
							class="w-[80px] h-[80px] rounded-[48px]"
						></img>
					) : (
						<p class="font-semibold text-white text-[23px] text-center align-middle leading-[80px]">
							{firstLetter()}
						</p>
					)}
				</div>
				<p
					class="text-[#4EADF1] text-[13px] font-semibold cursor-pointer"
					onClick={() => document.getElementById("profilePicture")?.click()}
				>
					Change
				</p>
			</div>

			<FormFieldGroup>
				<FormFieldInput
					label="First Name"
					placeholder="Enter your first name"
					disabled={props.isLoading}
					onInput={(input) => {
						setFirstLetter(input[0] || "B")
						props.addData({ first_name: input })
					}}
				/>
				<FormFieldInput
					borderNone={true}
					label="Last Name"
					placeholder="Enter your last name"
					disabled={props.isLoading}
					onInput={(input) => {
						props.addData({ last_name: input })
					}}
				/>
				<FormFieldDropdown
					borderBottom={true}
					label="Industry"
					disabled={props.isLoading}
					onChange={(input) => props.addData({ industry: input })}
					options={[
						"eCommerce",
						"Marketing & Sales",
						"Software",
						"Real estate",
						"Automotive",
						"HR",
						"Finance",
						"Hospitality",
						"Politics",
					]}
				/>
			</FormFieldGroup>
			<input
				type="file"
				class="hidden"
				id="profilePicture"
				accept="image/*"
				onChange={async (ev) => {
					const file = (ev.target as HTMLInputElement).files[0]
					if (!file) return
					setProfilePic(file)
					props.addData({ profileImage: file })
				}}
			></input>
		</div>
	)
}
