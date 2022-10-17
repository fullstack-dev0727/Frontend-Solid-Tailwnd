import { getContacts } from "@/api2/addressbook"
import { getProvider } from "@/api2/auth"
import { GMAIL_REDIRECT, HUBSPOT_REDIRECT, InviteSource, isDon, OUTLOOK_REDIRECT } from "@/app/Home/Steps/InviteFriends"
import { compareContacts, ContactList } from "@/app/Home/Steps/InviteFriends/connections"
import { useRequest } from "@/helpers/useRequest"
import { ContactInfo } from "@/types"
import { MenuItem, MenuItemTitle } from "@/ui/AppMenu"
import { MenuItemGroup } from "@/ui/AppMenu/MenuItemGroup"
import { MenuItemList } from "@/ui/AppMenu/MenuItemList"
import { GmailIcon } from "@/ui/icons/GmailIcon"
import { HubspotIcon } from "@/ui/icons/HubspotIcon"
import { OutlookIcon } from "@/ui/icons/OutlookIcon"
import { Spinner } from "@/ui/icons/Spinner"
import { InlineNav } from "@/ui/InlineNav"
import { Popup } from "@/ui/Popup/Popup"
import { StepMenuSeparator } from "@/ui/StepMenu"
import { createEffect, createSignal, For, JSX, JSXElement, Match, onMount, Show, Switch } from "solid-js"
import { setCurrentContacts, setCurrentProvider, setProviders, state as addressState } from "../state"

export const [isDisplay, setIsDisplay] = createSignal<boolean>(false);

export const enum FriendPickerPanels {
    Outlook,
    Gmail,
    Hubspot
}

const [addData, setAddData] = createSignal<ContactInfo[]>();
const [getProviders, isLoading] = useRequest(getProvider);

createEffect(async () => {
    const { result } = await getProviders("")
    setProviders(result)
})

export const ProviderMenu = (props: {
    name: string,
    selected?: boolean,
}) => {
    return (<MenuItem
        name={props.name}
        icon={() => <></>}
        active={props.selected}
        onClick={async () => {
            setCurrentProvider(props.name === addressState.currentProvider ? "all" : props.name);
            const { result } = await getContacts({ provider: addressState.currentProvider.toLowerCase(), size: 25 });
            setCurrentContacts(result.contacts);
        }}
    >
        {/* <SettingsIconButton onClick={() => {
            setContextMenu(!isActive);
        }} /> */}
    </MenuItem >
    )
}

export const ProviderMenus = () => {



    return <>
        <MenuItemGroup>
            <MenuItemTitle
                active={false}
                name="Providers"
                onClick={console.log}
                onClickPlus={() => setIsDisplay(true)}
            />
            <MenuItemList>
                {isLoading() ? <div class="flex items-center justify-center mt-10"><Spinner /></div> :
                    <For each={addressState.providers}>
                        {(provider) => <ProviderMenu name={provider as string} selected={addressState.currentProvider === provider}></ProviderMenu>}
                    </For>}
                {/* {addressState.providers ? addressState.providers : <div class="flex items-center justify-center mt-10"><Spinner /></div>} */}
            </MenuItemList>
        </MenuItemGroup>

        <Switch>
            <Match when={isDisplay()}>
                <Popup auto="true" onSubmit={async () => {
                    setIsDisplay(false);
                    setCurrentContacts(await (await getContacts({ provider: "all", size: 20 })).result.contacts);
                    setCurrentProvider("all");
                }}
                    onCancel={() => { setIsDisplay(false) }}>
                    <InviteFriends />
                </Popup>

            </Match>
        </Switch>
    </>
}



export const FriendPicker = (props: {
    firstPanel: FriendPickerPanels,
    token: string,

    // data: { selected?: Array<ContactInfo> }
}) => {
    const onSelect = (acc: ContactInfo) => setAddData([...(addData() || []), acc]);
    const onRemove = (acc: ContactInfo) => setAddData((addData() || []).filter(c => !compareContacts(c, acc)));
    const isSelected = (identifier: string) => addData()?.some(s => s.identifier === identifier);

    const components: Array<JSX.Element> = [
        // <ContactList panelName="LinkedIn" provider="linkedin" token={props.firstPanel === FriendPickerPanels.LinkedIn ? props.token : undefined} redirect={LINKEDIN_REDIRECT} onRemove={onRemove} onSelect={onSelect} isSelected={isSelected} />,
        <ContactList panelName="Microsoft" provider="microsoft" token={props.firstPanel === FriendPickerPanels.Outlook ? props.token : undefined} redirect={OUTLOOK_REDIRECT} onRemove={onRemove} onSelect={onSelect} isSelected={isSelected} />,
        isDon && <ContactList panelName="Gmail" provider="google" token={props.firstPanel === FriendPickerPanels.Gmail ? props.token : undefined} redirect={GMAIL_REDIRECT} onRemove={onRemove} onSelect={onSelect} isSelected={isSelected} />,
        <ContactList panelName="Hubspot" provider="hubspot" token={props.firstPanel === FriendPickerPanels.Hubspot ? props.token : undefined} redirect={HUBSPOT_REDIRECT} onRemove={onRemove} onSelect={onSelect} isSelected={isSelected} />
    ]
    return <InlineNav navigation={(navigate, current, currentInd) => {
        return <div class="flex flex-col gap-2">
            <div class="flex gap-6">
                {/*
                <div class={`flex justify-center items-center gap-[5px] font-semibold cursor-pointer ${currentInd() !== FriendPickerPanels.LinkedIn ? "opacity-50" : ""}`} onClick={() => navigate(FriendPickerPanels.LinkedIn)}>
                    <LinkedInIcon size="17px" />
                    <p class="text-[15px]">LinkedIn</p>
                </div>
                */}
                <div class={`flex justify-center items-center gap-[5px] font-semibold cursor-pointer ${currentInd() !== FriendPickerPanels.Outlook ? "opacity-50" : ""}`} onClick={() => navigate(FriendPickerPanels.Outlook)}>
                    <OutlookIcon size="17px" />
                    <p class="text-[15px]">Microsoft</p>
                </div>
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

export const InviteFriends = () => {
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
            {/* 
            <InviteSource
                redirect={LINKEDIN_REDIRECT}
                onClick={() => setOauthTokenType(FriendPickerPanels.LinkedIn)}
                icon={<LinkedInIcon size="34px" />}
                name="LinkedIn"
                description="Invite your LinkedIn connections"
            />
            <StepMenuSeparator />
            /> */}
            <InviteSource
                icon={<OutlookIcon size="40px" />}
                redirect={OUTLOOK_REDIRECT}
                onClick={() => setOauthTokenType(FriendPickerPanels.Outlook)}
                name="Microsoft"
                description="Invite your Microsoft contacts"
            />
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
                description="Invite your hubspot contacts"
            />

        </div> : <FriendPicker firstPanel={oauthTokenType()} token={oauthToken()} />
        }
    </>
}