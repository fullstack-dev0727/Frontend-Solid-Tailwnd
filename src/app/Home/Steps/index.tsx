import { useRequest } from "@/helpers/useRequest"
import { StepMenu } from "@/ui/StepMenu"
import { InviteFriends } from "./InviteFriends"
import { ProfileSetup } from "./ProfileSetup"
import * as UserApi from "@/api2/user"
import * as InviteApi from "@/api2/invite"
import { ContactInfo } from "@/api2/addressbook"
import { setIsNewUser } from "../state"
import * as AIStudioState from "@/app/AIStudio/state"
import Tap from "@tapfiliate/tapfiliate-js"
import { createSignal } from "solid-js"
import { autoJoin } from "../Feed/state"

export const Steps = () => {
	const [createUserRequest, isLoading1] = useRequest(UserApi.create)
	const [invitePeople, isLoading3] = useRequest(InviteApi.create)
	const [userId, setUserId] = createSignal("")

	let firstName: string, lastName: string

	return (
		<StepMenu
			isNextLoading={isLoading1() || isLoading3()}
			menus={[
				{
					title: <p class="fadein">Welcome</p>,
					description: (
						<p class="fadein max-w-[386px]">
							We’re building outrageous apps that give your business an unfair
							advantage. They’re all <b>Free.</b>
						</p>
					),
					body: () => <></>,
				},
				{
					title: <p class="fadein">What's your name?</p>,
					description: <p class="fadein">Let’s get your profile setup</p>,
					body: (props) => (
						<ProfileSetup
							isLoading={isLoading1()}
							{...props}
						/>
					),
					onNext: async (data: {
						first_name: string
						last_name: string
						industry: string
						profileImage?: Blob
					}) => {
						if (!data.first_name || !data.last_name || !data.industry)
							return "All fields must be present."
						const email = localStorage.getItem("email")
						if (!email) return "An error occurred."
						const { code, result } = await createUserRequest({
							first_name: data.first_name,
							last_name: data.last_name,
							email: email,
							picture: data.profileImage
								? await UserApi.setProfilePicture(data.profileImage)
								: undefined,
						})
						if (code !== 200) return "An error occurred."
						// else {
						// 	// Auto Join Feed Groups
						// 	autoJoin(result.user)
						// }
						if (result.workspace) {
							AIStudioState.addWorkspace(result.workspace)
							AIStudioState.setCurrentWorkspace(result.workspace.workspace_id)
						}
						if (result.folder) AIStudioState.addFolders(result.folder)
						if (result.instance)
							AIStudioState.addVideos({
								...result.instance,
								created_at: new Date(result.instance.created_at),
							})
						if (result.user) {
							setUserId(result.user.user_id)
						}
						return undefined
					},
				},
				{
					title: "Invite your friends too",
					description:
						"80% of our users invite their friends. Let’s bring your friends too.",
					noSeparator: true,
					allowSkip: true,
					onNext: async (data: { selected?: ContactInfo[] }) => {
						if (!data.selected) return
						await invitePeople({
							sender: {
								first_name: firstName,
								last_name: lastName,
							},
							receivers: data.selected
								.filter(
									(selected) =>
										selected.phone_numbers.length ||
										selected.email_addresses.length
								)
								.map((selected) => {
									const [firstName, lastName] = selected.name.split(" ")
									return {
										first_name: firstName,
										last_name: lastName || "",
										email: selected.email_addresses[0] || "",
										phone: selected.phone_numbers[0] || "",
									}
								}),
						})
					},
					body: InviteFriends,
				},
				{
					title: "All Set",
					description: "You are all set!",
					buttonText: "Finish",
					body: () => <></>,
				},
			]}
			dontCountLast
			onFinish={() => {
				localStorage.removeItem("is_new_user")
				localStorage.removeItem("email")
				setIsNewUser(false)

				Tap.customer(userId())
			}}
		/>
	)
}
