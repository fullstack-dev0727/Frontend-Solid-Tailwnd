import { GmailIcon } from "@/ui/icons/GmailIcon"
import { HubspotIcon } from "@/ui/icons/HubspotIcon"
import { OutlookIcon } from "@/ui/icons/OutlookIcon"
import { ParentProps } from "solid-js"
import {
	GMAIL_REDIRECT,
	HUBSPOT_REDIRECT,
	OUTLOOK_REDIRECT,
} from "../Steps/InviteFriends"

export const InviteSideBar = () => {
	return (
		<div class="flex flex-col gap-[12px] p-[24px] w-[330px] h-full flex-shrink-0 pt-[63px] bg-[#F3F3F3]">
			<div class="flex flex-col rounded-[24px] w-full">
				<p class="font-[600]">Invite your friends</p>
				<p class="">Invite your friends and earn credits</p>
			</div>
			<hr class="bg-[#D2D2D7]" />
			<div class="flex">
				<FriendsPicker />
			</div>
		</div>
	)
}

export const FriendsPicker = () => {
	return (
		<div class="flex flex-col gap-[16px] w-full text-[15px] font-[500]">
			{/*
                <div class={`flex items-center gap-[5px] cursor-pointer ${currentInd() !== FriendPickerPanels.LinkedIn ? "opacity-50" : ""}`} onClick={() => navigate(FriendPickerPanels.LinkedIn)}>
                    <LinkedInIcon size="34px" />
                    <p class="text-[15px]">LinkedIn</p>
                </div>
                */}
			<InviteContainer
				name="Microsoft"
				redirect_url={OUTLOOK_REDIRECT}
			>
				<>
					<OutlookIcon size="34px" />
					<p class="text-[15px] leading-[22.5px]">Microsoft</p>
				</>
			</InviteContainer>
			<InviteContainer
				name="Google"
				redirect_url={GMAIL_REDIRECT}
			>
				<>
					<GmailIcon size="34px" />
					<p class="text-[15px] leading-[22.5px]">Google</p>
				</>
			</InviteContainer>
			<InviteContainer
				name="Hubspot"
				redirect_url={HUBSPOT_REDIRECT}
			>
				<>
					<HubspotIcon size="34px" />
					<p class="text-[15px] leading-[22.5px]">Hubspot</p>
				</>
			</InviteContainer>
		</div>
	)
}

export const InviteButton = () => {
	return (
		<button class="flex items-center justify-center rounded-[24px] w-[91px] h-[36px] text-[#187FE7] border-[#187FE7] border-[1px]">
			Invite
		</button>
	)
}

export const InviteContainer = (
	props: ParentProps<{ name: string; redirect_url: string }>
) => {
	return (
		<div
			class={`flex items-center gap-[80px] cursor-pointer  `}
			onClick={() => window.open(props.redirect_url)}
		>
			<div class="flex items-center gap-[8px] w-[111px] h-[40px] font-[600] font-inter">
				{props.children}
			</div>
			<InviteButton />
		</div>
	)
}
