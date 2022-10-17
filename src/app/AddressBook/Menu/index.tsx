import { Component, For, onMount, useContext } from "solid-js"
import {
	AppMenu,
	MenuItemTitle,
	AppTitle,
	MenuItemSeperator,
	AppMenuBody
} from "@/ui/AppMenu"
import { ThreePointIconButton } from "@/ui/icons/ThreePointIconButton"
import { addTags, setCurrentTag, setState, state } from "../state"
import { MenuItemList } from "@/ui/AppMenu/MenuItemList"
import { MenuItemGroup } from "@/ui/AppMenu/MenuItemGroup"
import { AppNavigator, AppNavigatorContext } from "@/ui/AppNavigator"
import { useRequest } from "@/helpers/useRequest"
import { tags } from "@/api2/addressbook"
import { Spinner } from "@/ui/icons/Spinner"
import { TagInfo } from "../types"
import { TagMenu } from "./Tag"
import { BookIcon } from "@/ui/icons/BookIcon"
import { ProviderMenus } from "./Providers"

export const Menu: Component = () => {
	const [getTagsReq, isLoading] = useRequest(tags.list);

	const ctx = useContext(AppNavigatorContext);

	onMount(async () => {
		if (state.tags.length) return;
		const tags = await getTagsReq({});
		if (tags.code !== 200) return;
		let selectedTag = ctx.location[ctx.location.length - 2] === "tag" && ctx.location[ctx.location.length - 1];
		addTags(...tags.result);
		if (selectedTag) {
			if (tags.result.some(t => t.id === selectedTag)) setCurrentTag(selectedTag);
			else ctx.navigate("./");
		}
	});

	return (
		<AppMenu>
			<div>
				<AppTitle
					name={"Address Book"}
					active={false}
					icon={"/icons/address_book.svg"}
					theme={"black"}
					onClick={console.log}
				>
					<ThreePointIconButton />
				</AppTitle>
				<MenuItemSeperator />
			</div>

			<AppMenuBody>
				<AppNavigator noWelcome simple={[
					{
						name: "Contacts",
						path: "",
						icon: <BookIcon size="17px" />,
						onClick: () => setState("currentTag", "")
					}
				]} routes={(navigate, selected) => {
					return <>
						<ProviderMenus />
						<MenuItemGroup>
							<MenuItemTitle
								active={false}
								name="Tags"
								onClick={console.log}
								onClickPlus={async () => {
									const tag = await tags.create({name: "New Tag"});
									if (tag.code !== 200) return;
									addTags(tag.result);
								}}
							/>
							<MenuItemList>
								{isLoading() ? <div class="flex items-center justify-center mt-10"><Spinner /></div> : <For each={state.tags}>
									{(tag) => <TagMenu tag={tag as TagInfo} navigate={navigate} selected={selected === tag.id} />}
								</For>}
							</MenuItemList>
						</MenuItemGroup>
					</>
				}} />
			</AppMenuBody>
		</AppMenu>
	)
}
