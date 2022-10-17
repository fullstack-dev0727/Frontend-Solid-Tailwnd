import { AppMenu, AppMenuBody, AppTitle, MenuItem, MenuItemTitle } from "@/ui/AppMenu"
import { MenuItemGroup } from "@/ui/AppMenu/MenuItemGroup"
import { MenuItemList } from "@/ui/AppMenu/MenuItemList"
import { NewIconButton } from "@/ui/IconButtons/new"
import SettingsIconButton from "@/ui/IconButtons/settings"
import { TagIcon } from "@/ui/icons"
import { ThreePointIconButton } from "@/ui/icons/ThreePointIconButton"
import { For } from "solid-js"
import { setCurrentInbox, state } from "./state"
import { AppNavigator } from "@/ui/AppNavigator"

const routes = [
    {
        name: "Campaigns",
        route: "campaigns"
    },
    {
        name: "Analytics",
        route: "analytics"
    },
    {
        name: "Leads",
        route: "leads"
    }
]

export const Explorer = () => {

    return <AppMenu>
        <div>
            <AppTitle
                name="Lead-R"
                active={false}
                icon="../icons/address_book.svg"
                theme="black"
                onClick={() => { }}
            >
                <ThreePointIconButton />
            </AppTitle>
            <div class="bg-black/[0.08] w-full h-[1px] rounded-xl" />
        </div>

        <AppMenuBody>
            <AppNavigator routes={(navigate, selected) => {
                return <>
                    <MenuItemList>
                        <For each={routes}>{(route) => {
                            return <MenuItem
                                name={route.name}
                                active={selected === route.route}
                                icon={<img src="../icons/contacts.svg" />}
                                onClick={() => navigate(route.route) }
                            />
                        }}</For>
                    </MenuItemList>
                </>
            }} />

            <MenuItemGroup>
                <MenuItemTitle
                    active={false}
                    name="Inboxes"
                    onClick={console.log}
                    onClickPlus={console.log}
                />
                <MenuItemList>
                    <For each={state.inboxes}>{(inbox, ind) => {
                        return <MenuItem
                            name={inbox.name}
                            active={state.selectedInbox === ind()}
                            icon={() => <TagIcon size={() => 16} />}
                            onClick={() => {
                                setCurrentInbox(ind());
                            }}
                        >
                            <SettingsIconButton />
                            <NewIconButton />
                        </MenuItem>
                    }}</For>
                </MenuItemList>
            </MenuItemGroup>
        </AppMenuBody>
    </AppMenu>
}