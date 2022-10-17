import { createSignal, Show } from "solid-js"
import { useNavigate } from "solid-app-router"
import { createFormActions, Errors } from "solid-form-action"
import { LogOutIcon } from "@/assets/icons"
import { InputButton } from "@/ui/Button/InputButton"
import { state, updateUser, getUserValue } from "./state"

export const Profile = () => {
	const navigate = useNavigate()
	const [is_firstname_loading, setFirstnameIsLoading] = createSignal(false)
	const [is_lastname_loading, setLastnameIsLoading] = createSignal(false)

	const {
		actions: { first_name },
		form: firstname_form,
		formState: { first_name: firstNameVal },
		errors: FirstNameFormError,
	} = createFormActions({
		initialValues: {
			first_name: getUserValue("first_name") || "first_name",
		},
		validate: (values) => {
			const errs: Errors<typeof values> = {}
			if (!values?.first_name || values.first_name.length === 0) {
				errs.first_name = "First Name is required"
			}
			return errs
		},
		onSubmit: async (values) => {
			if (values.first_name !== getUserValue("first_name")) {
				setFirstnameIsLoading(true)
				await updateUser([{ key: "first_name", value: values["first_name"] }])
				console.log("First name updated: ", values["first_name"])
				setFirstnameIsLoading(false)
			}
		},
	})

	const {
		actions: { last_name },
		form: lastname_form,
		formState: { last_name: lastNameVal },
		errors: LastNameFormError,
	} = createFormActions({
		initialValues: {
			last_name: getUserValue("last_name") || "last_name",
		},
		validate: (values) => {
			const errs: Errors<typeof values> = {}
			if (!values?.last_name || values.last_name.length === 0) {
				errs.last_name = "Last Name is required"
			}
			return errs
		},
		onSubmit: async (values) => {
			if (values.last_name !== getUserValue("last_name")) {
				setLastnameIsLoading(true)
				await updateUser([{ key: "last_name", value: values["last_name"] }])
				console.log("Last name updated: ", values["last_name"])
				setLastnameIsLoading(false)
			}
		},
	})

	return (
		<section class="p-8 grow flex flex-col place-content-between">
			<div class="flex flex-col gap-y-8">
				{/* <div class="flex flex-col gap-y-2">
					<h1 class="text-2xl font-semibold pl-1.5">Username</h1>
					<div class="flex w-60 group items-center py-1.5 px-2 rounded-md place-content-between">
						<h2 class="w-full bg-transparent focus:outline-none font-medium">
							{state?.user?.username ? state?.user?.username : "-"}
						</h2>
					</div>
				</div> */}
				{/* @ts-ignore */}
				{/* <form use:fullname_form>
					<div class="flex flex-col gap-y-2">
						<label
							for="fullname"
							class="text-2xl font-semibold pl-1.5"
						>
							Fullname
						</label>
						<InputButton
							id="fullname"
							name="fullname"
							isupdating={is_fullname_loading()}
							ref={fullname}
							placeholder={getUserFullName()}
						/>
					</div>
				</form> */}
				{/* @ts-ignore */}
				<form use:firstname_form>
					<div class="flex flex-col gap-y-2">
						<label
							for="first_name"
							class="text-2xl font-semibold pl-1.5"
						>
							First Name
						</label>
						<InputButton
							id="first_name"
							name="first_name"
							isupdating={is_firstname_loading()}
							ref={first_name}
							placeholder={getUserValue("first_name")}
						/>
						<Show when={FirstNameFormError.first_name}>
							<div class="px-2 text-xs text-red-500">
								*{FirstNameFormError.first_name}
							</div>
						</Show>
					</div>
				</form>
				{/* @ts-ignore */}
				<form use:lastname_form>
					<div class="flex flex-col gap-y-2">
						<label
							for="last_name"
							class="text-2xl font-semibold pl-1.5"
						>
							Last Name
						</label>
						<InputButton
							id="last_name"
							name="last_name"
							isupdating={is_lastname_loading()}
							ref={last_name}
							placeholder={getUserValue("last_name")}
						/>
						<Show when={LastNameFormError.last_name}>
							<div class="px-2 text-xs text-red-500">
								*{LastNameFormError.last_name}
							</div>
						</Show>
					</div>
				</form>

				<div class="flex flex-col gap-y-2">
					<h1 class="text-2xl font-semibold pl-1.5">Login Email</h1>
					<div class="flex w-60 group items-center py-1.5 px-2 rounded-md place-content-between">
						<h2 class="w-full bg-transparent focus:outline-none font-medium">
							{state?.user?.email}
						</h2>
					</div>
				</div>
				<div class="bg-slate-200 cursor-default inline-flex hover:bg-slate-300 group rounded-xl px-4 py-2">
					<p class="inline font-semibold text-slate-600">
						BHuman uses passwordless login secured by your email.
					</p>
				</div>
				<div class="">
					<button
						onClick={() => {
							localStorage.removeItem("access_token")
							localStorage.removeItem("refresh_token")
							localStorage.removeItem("user_id")
							// localStorage.clear()
							navigate("/", { replace: true })
						}}
						class="group relative w-32 flex items-center gap-x-2 justify-center py-1 px-4 border border-transparent font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
					>
						Logout <LogOutIcon class="w-5 h-5" />
					</button>
				</div>
			</div>
			<h2 class="text-2xl font-semibold">
				Need help? Please email Help@BHuman.ai
			</h2>
		</section>
	)
}
export default Profile

// const [is_fullname_loading, setFullnameIsLoading] = createSignal(false)

// const parseInput = (input: string) => {
// 	if (!input) return ""
// 	const names = input.trim().split(" ")
// 	if (names.length === 0) return ["", ""]
// 	const first =
// 		names.length > 1 ? names.slice(0, names.length - 1).join(" ") : names[0]
// 	const last = names.length > 1 ? names[names.length - 1] : ""
// 	return [first, last]
// }

// const {
// 	actions: { fullname },
// 	form: fullname_form,
// 	formState: { fullname: fullnameVal },
// 	errors: FullnameFormError,
// } = createFormActions({
// 	initialValues: {
// 		fullname: getUserFullName() || "fullname",
// 	},
// 	validate: (values) => {
// 		const errs: Errors<typeof values> = {}
// 		if (!values?.fullname || values.fullname.length === 0) {
// 			errs.fullname = "Fullname is required"
// 		}
// 		return errs
// 	},
// 	onSubmit: async (values) => {
// 		if (values.fullname !== getUserFullName()) {
// 			setFullnameIsLoading(true)
// 			const [first, last] = parseInput(values["fullname"])
// 			await updateUser([
// 				{ key: "first_name", value: first },
// 				{ key: "last_name", value: last },
// 			])
// 			console.log("Fullname updated: ", values["fullname"])
// 			setFullnameIsLoading(false)
// 		}
// 	},
// })
