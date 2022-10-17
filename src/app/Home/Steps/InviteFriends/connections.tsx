import { SearchIcon } from "@/ui/icons/SearchIcon"
import { Spinner } from "@/ui/icons/Spinner"
import { Scrollable } from "@/ui/Scrollable"
import { createEffect, createSignal, For, onMount } from "solid-js"
import { createStore } from "solid-js/store"
import { usePagination } from "@/helpers/useRequest"
import { getContacts, ContactInfo, syncContacts, getHubspotContacts } from "@/api2/addressbook"
import { HUBSPOT_REDIRECT_URI } from "."
import { setCurrentProvider } from "@/app/AddressBook/state"

const COLORS = ["#84f542", "#44fcde", "#9f39ed", "#edd539", "#3d66fc", "#ff6bab"];

export const DefaultImage = (props: {
    initials: string
}) => {
    return <div class="rounded-full w-[36px] h-[36px] bg-gray-600 flex justify-center items-center" style={{
        "background-color": COLORS[Math.floor(Math.random() * COLORS.length) + 1]
    }}>
        <p>{props.initials}</p>
    </div>
}

export const Contact = (props: ContactInfo & {
    selected?: boolean,
    onSelect: () => void,
    onRemove: () => void
}) => {
    return <div class="flex gap-3 items-center cursor-pointer" onClick={() => {
        if (props.selected) props.onRemove();
        else props.onSelect();
    }}>
        {(props.photo && props.photo !== "unknown") ? 
            <img class="rounded-full w-[36px] h-[36px] bg-gray-600" src={props.photo} referrerpolicy="no-referrer"></img> : <DefaultImage initials={props.name[0]} />}
        <div class="flex justify-between border-b pb-1 items-center grow">
            <div class="flex flex-col">
                <p class="text-[15px] font-semibold text-black/[80%]">{props.name}</p>
                <p class="text-[11px] text-black/[60%]">{props.phone_numbers[0] || "N/A"}</p>
            </div>
            <div>
                <div class={`w-[20px] h-[20px] border-[1px] border-[#C7C6CB] rounded-full ${props.selected ? "bg-[#4EADF1]" : ""}`}></div>
            </div>
        </div>
    </div>
}


export const ContactList = (props: {
    panelName: string,
    provider: string,
    redirect?: string,
    token?: string,
    onSelect?: (selected: ContactInfo) => void,
    onRemove?: (removed: ContactInfo) => void,
    isSelected: (identifier: string) => boolean | undefined
}) => {
    const [token, setToken] = createSignal(props.token);
    const [filtered, setFiltered] = createSignal<ContactInfo[]>();
    const [contacts, setContacts] = createStore([]);
    const [getContactsAPI, isLoading, isFinished] = usePagination(getContacts, (res) => res.result.contacts.length === 0);

    let hasBeenClicked = false;
    let timeout: NodeJS.Timeout;

    createEffect(async () => {
        if (!token()) return;
        if (props.provider === "hubspot") {
            await getHubspotContacts({
                code: token(),
                redirect_uri: decodeURIComponent(HUBSPOT_REDIRECT_URI)
            });
            await syncContacts({
                email: "",
                token: "",
                provider: props.provider,
                phone: ""
            });
        } else {
        await syncContacts({
            email: localStorage.getItem("email"),
            token: token(),
            provider: props.provider,
            phone: ""
            });
        }
        setCurrentProvider(props.provider);
        const contacts = await getContactsAPI({ provider: props.provider, size: 20 });
        if (contacts.code !== 200) return;
        setContacts(contacts.result.contacts);
    });

    onMount(() => {
        const eventFn = (ev: StorageEvent) => {
            if (!hasBeenClicked) return;
            if (ev.key === "oauth_token" && ev.newValue) {
                setToken(ev.newValue);
                window.removeEventListener("storage", eventFn);
            }
        };
        window.addEventListener("storage", eventFn);
    });

    return <div class="flex flex-col gap-4">
        {token() ? contacts.length ? <>
            <div class="bg-black/[0.06] rounded-xl p-3 flex gap-2 h-[40px] items-center focus-within:outline focus-within:outline-2">
                <SearchIcon size="12px" />
                <input class="w-full bg-transparent text-[15px] outline-none" placeholder={`Search ${props.panelName} contacts`} onInput={(el) => {
                    if (timeout) clearTimeout(timeout);
                    const value = (el.target as HTMLInputElement).value;
                    if (!value.trim().length) {
                        setFiltered();
                        return;
                    };
                    timeout = setTimeout(async () => {
                        const value = (el.target as HTMLInputElement).value;
                        const res = await getContacts({ provider: props.provider, query: value });
                        if (!value.trim().length) {
                            setFiltered();
                            return;
                        };
                        if (res.code !== 200) return;
                        setFiltered(res.result.contacts);
                    }, 200);
                }}></input>
            </div>
            <Scrollable visibleStyle={{ "padding-right": "10px" }} onScrollEnd={async () => {
                if (isFinished()) return;
                const contacts = await getContactsAPI({ provider: props.provider, size: 20 });
                setContacts((c) => [...c, ...contacts.result.contacts]);
            }}><div class="flex flex-col gap-2 max-h-[200px]">
                    {
                        filtered() ? <For each={filtered()}>{(contact) => {
                            return <Contact {...contact} selected={props.isSelected(contact.identifier)} onSelect={() => {
                                if (!contacts.some(c => c.identifier === contact.identifier)) setContacts(c => [...c, contact]);
                                props.onSelect?.(contact);
                            }} onRemove={() => props.onRemove?.(contact)} />
                        }}</For> : <For each={contacts}>{(contact) => {
                            return <Contact {...contact} selected={props.isSelected(contact.identifier)} onSelect={() => props.onSelect?.(contact)} onRemove={() => props.onRemove?.(contact)} />
                        }}</For>
                    }
                    {isLoading() && <Scrollable />}
                </div></Scrollable>
        </> : <div class="flex justify-center items-center">
            <Spinner />
        </div> : <div class="flex justify-center items-center">
            <a href={props.redirect} target="_blank" onClick={() => hasBeenClicked = true}>
                <div class="bg-[#4EADF1] text-white p-3 rounded-[16px] mt-4 cursor-pointer">
                    <p>Connect</p>
                </div>
            </a>
        </div>}
    </div>
}

export function compareContacts(a: ContactInfo, b: ContactInfo): boolean {
    return a.identifier === b.identifier;
}