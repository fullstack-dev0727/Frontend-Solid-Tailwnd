import { ContactInfo } from "@/api2/addressbook";
import { GmailIcon } from "@/ui/icons/GmailIcon";
//import { LinkedInIcon } from "@/ui/icons/LinkedInIcon";
import { HubspotIcon } from "@/ui/icons/HubspotIcon";
import { LinkedInIcon } from "@/ui/icons/LinkedInIcon";
import { OutlookIcon } from "@/ui/icons/OutlookIcon";
//import { OutlookIcon } from "@/ui/icons/OutlookIcon";
import { InlineNav } from "@/ui/InlineNav";
import { StepMenuAddData, StepMenuProps, StepMenuSeparator } from "@/ui/StepMenu"
import { createSignal, JSX, JSXElement, onMount, Show } from "solid-js"
import { compareContacts, ContactList } from "./connections";

export const enum FriendPickerPanels {
    Outlook,
    // LinkedIn,
    Gmail,
    Hubspot
}

let login_redirect_url = '';

if (window.location.href.includes('localhost')) {
    login_redirect_url = '&login_redirect_url=http://localhost:3000/verify'
} else {
    login_redirect_url = import.meta.env.MODE == 'stage' ? '&login_redirect_url=https://app.stage.bhuman.ai/verify' : import.meta.env.MODE == 'dev' ? '&login_redirect_url=https://app.dev.bhuman.ai/verify' : ''
}


export const GMAIL_REDIRECT = `https://api.stytch.bhuman.ai/v1/public/oauth/google/start?public_token=public-token-live-3780acd3-6da2-4987-84e0-abc2207f6508&custom_scopes=https://www.googleapis.com/auth/contacts.readonly${login_redirect_url}`;
export const OUTLOOK_REDIRECT = `https://api.stytch.bhuman.ai/v1/public/oauth/microsoft/start?public_token=public-token-live-3780acd3-6da2-4987-84e0-abc2207f6508&custom_scopes=Contacts.Read${login_redirect_url}`;
export const LINKEDIN_REDIRECT = `https://api.stytch.bhuman.ai/v1/public/oauth/linkedin/start?public_token=public-token-live-3780acd3-6da2-4987-84e0-abc2207f6508${login_redirect_url}`;
// export const HUBSPOT_REDIRECT_URI = import.meta.env.MODE == 'dev'? encodeURIComponent("http://localhost:3000/verify") :  encodeURIComponent("https://app.bhuman.ai/verify");
export const HUBSPOT_REDIRECT_URI = "https://apps.bhuman.ai/verify";
// export const HUBSPOT_CLIENT_ID = "612baedf-f566-41f3-b470-290a93016769";
export const HUBSPOT_CLIENT_ID = "2d4dfc92-3da0-47b6-92c1-91c3e8feba06";
export const HUBSPOT_REDIRECT = `https://app.hubspot.com/oauth/authorize?client_id=${HUBSPOT_CLIENT_ID}&redirect_uri=${HUBSPOT_REDIRECT_URI}&scope=crm.lists.read%20crm.objects.contacts.read`;


export const isDon = localStorage.getItem('email')?.includes("don@bhuman.ai");

export const FriendPicker = (props: {
    firstPanel: FriendPickerPanels,
    token: string,
    addData: StepMenuAddData,
    data: { selected?: Array<ContactInfo> }
}) => {
    const onSelect = (acc: ContactInfo) => props.addData("selected", (data?: ContactInfo[]) => [...(data || []), acc]);
    const onRemove = (acc: ContactInfo) => props.addData("selected", (data?: ContactInfo[]) => (data || []).filter(c => !compareContacts(c, acc)));
    const isSelected = (identifier: string) => props.data.selected?.some(s => s.identifier === identifier);



    const components: Array<JSX.Element> = [
        <ContactList panelName="Microsoft" provider="microsoft" token={props.firstPanel === FriendPickerPanels.Outlook ? props.token : undefined} redirect={OUTLOOK_REDIRECT} onRemove={onRemove} onSelect={onSelect} isSelected={isSelected} />,
        // <ContactList panelName="LinkedIn" provider="linkedin" token={props.firstPanel === FriendPickerPanels.LinkedIn ? props.token : undefined} redirect={LINKEDIN_REDIRECT} onRemove={onRemove} onSelect={onSelect} isSelected={isSelected} />, 
        isDon && <ContactList panelName="Gmail" provider="google" token={props.firstPanel === FriendPickerPanels.Gmail ? props.token : undefined} redirect={GMAIL_REDIRECT} onRemove={onRemove} onSelect={onSelect} isSelected={isSelected} />,
        <ContactList panelName="Hubspot" provider="hubspot" token={props.firstPanel === FriendPickerPanels.Hubspot ? props.token : undefined} redirect={HUBSPOT_REDIRECT} onRemove={onRemove} onSelect={onSelect} isSelected={isSelected} />
    ]
    return <InlineNav navigation={(navigate, current, currentInd) => {
        return <div class="flex flex-col gap-2">
            <div class="flex gap-6">
                <div class={`flex justify-center items-center gap-[5px] font-semibold cursor-pointer ${currentInd() !== FriendPickerPanels.Outlook ? "opacity-50" : ""}`} onClick={() => navigate(FriendPickerPanels.Outlook)}>
                    <OutlookIcon size="17px" />
                    <p class="text-[15px]">Microsoft</p>
                </div>
                {/* <div class={`flex justify-center items-center gap-[5px] font-semibold cursor-pointer ${currentInd() !== FriendPickerPanels.LinkedIn ? "opacity-50" : ""}`} onClick={() => navigate(FriendPickerPanels.LinkedIn)}>
                    <LinkedInIcon size="17px" />
                    <p class="text-[15px]">LinkedIn</p>
                </div> */}
                <Show when={isDon}>
                    <div class={`flex justify-center items-center gap-[5px] font-semibold cursor-pointer ${currentInd() !== FriendPickerPanels.Gmail ? "opacity-50" : ""}`} onClick={() => navigate(FriendPickerPanels.Gmail)}>
                        <GmailIcon size="17px" />
                        <p class="text-[15px]">Gmail</p>
                    </div>
                </Show>
                <div class={`flex justify-center items-center gap-[5px] font-semibold cursor-pointer ${currentInd() !== FriendPickerPanels.Hubspot ? "opacity-50" : ""}`} onClick={() => navigate(FriendPickerPanels.Hubspot)}>
                    <HubspotIcon size="17px" />
                    <p class="text-[15px]">Hubspot</p>
                </div>
            </div>
            <StepMenuSeparator />
            {current()}
        </div>
    }} components={components} startAt={props.firstPanel} />
}

export const InviteSource = (props: {
    icon: JSXElement,
    onClick?: () => void,
    redirect?: string,
    name: string,
    description: string
}) => {
    return <div class="flex justify-between items-center">
        <div class="flex gap-4">
            {props.icon}
            <div class="flex flex-col gap-1">
                <p class="text-[15px] font-semibold">{props.name}</p>
                <p class="text-[13px] text-blacl/[70%]">{props.description}</p>
            </div>
        </div>
        <div>
            <a class="text-[15px] text-[#368BC9] font-semibold cursor-pointer" href={props.redirect} target="_blank" onClick={props.onClick}>Find Contacts</a>
        </div>
    </div>
}

export const InviteFriends = (props?: StepMenuProps) => {
    const [oauthToken, setOauthToken] = createSignal<string>();
    const [oauthTokenType, setOauthTokenType] = createSignal<number>();

    onMount(() => {
        window.addEventListener("storage", (ev) => {
            if (ev.key === "oauth_token" && ev.newValue) {
                setOauthToken(ev.newValue);
            }
        }, { once: true });
    });

    return <>
        {!oauthToken() || oauthTokenType() === undefined ? <div class="flex flex-col gap-4">
            <InviteSource
                icon={<OutlookIcon size="40px" />}
                redirect={OUTLOOK_REDIRECT}
                onClick={() => setOauthTokenType(FriendPickerPanels.Outlook)}
                name="Microsoft"
                description="Invite your Microsoft contacts"
            />
            {/* <StepMenuSeparator />
            <InviteSource
                redirect={LINKEDIN_REDIRECT}
                onClick={() => setOauthTokenType(FriendPickerPanels.LinkedIn)}
                icon={<LinkedInIcon size="34px" />}
                name="LinkedIn"
                description="Invite your LinkedIn connections"
            /> */}
            <Show when={isDon}>
                <StepMenuSeparator />
                <InviteSource
                    redirect={GMAIL_REDIRECT}
                    onClick={() => setOauthTokenType(FriendPickerPanels.Gmail)}
                    icon={<GmailIcon size={"40px"} />}
                    name="Gmail"
                    description="Invite your Gmail contacts"
                />
            </Show>
            <StepMenuSeparator />
            <InviteSource
                icon={<HubspotIcon size="40px" />}
                redirect={HUBSPOT_REDIRECT}
                onClick={() => setOauthTokenType(FriendPickerPanels.Hubspot)}
                name="Hubspot"
                description="Invite your Hubspot contacts"
            />
        </div> : <FriendPicker firstPanel={oauthTokenType()} token={oauthToken()} addData={props.addData} data={props.data} />}
    </>
}
