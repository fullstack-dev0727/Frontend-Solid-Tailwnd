import { For, Show } from "solid-js"
import {
	AppMenu,
	AppMenuBody,
	AppTitle,
	MenuItem,
	MenuItemTitle,
	GroupItem,
} from "@/ui/AppMenu"
import { MenuItemGroup } from "@/ui/AppMenu/MenuItemGroup"
import { MenuItemSearch } from "@/ui/AppMenu/MenuItemSeach"
import { ThreePointIconButton } from "@/ui/icons/ThreePointIconButton"
import { isNewUser } from "./state"
import { setActiveTab, activeTab } from "./main"
import { state } from "./Feed/state"
import { setSelectedGroup, feedState } from "./Feed/handlers/fetch_feed"
import { LoadingIcon } from "@/assets/icons"

export const Explorer = () => {
	return (
		<AppMenu>
			<div>
				<AppTitle
					name="Home"
					active={false}
					icon="../icons/address_book.svg"
					theme="black"
					onClick={() => {}}
				>
					<ThreePointIconButton />
				</AppTitle>
				<div class="bg-black/[0.08] w-full h-[1px] rounded-xl" />
			</div>

			<AppMenuBody>
				<MenuItemGroup>
					{isNewUser() ? (
						<MenuItem
							name={"Profile Setup"}
							active={true}
							icon={<img src="../icons/contacts.svg" />}
							onClick={() => {}}
						/>
					) : (
						<>
							{/* <MenuItem
								name={"QuickStart"}
								active={activeTab() === "QuickStart"}
								icon={<img src="../icons/contacts.svg" />}
								onClick={() => setActiveTab("QuickStart")}
							/> */}
							<MenuItem
								name={"Feed"}
								active={activeTab() === "Feed" && !feedState.selectedGroup}
								icon={<img src="../icons/contacts.svg" />}
								onClick={() => {
									setActiveTab("Feed")
									setSelectedGroup(null)
								}}
							/>
						</>
					)}
					{/* <MenuItem
						name={"Saved"}
						active={false}
						icon={<img src="../icons/bookmark.svg" />}
						onClick={() => {}}
					/>
					<MenuItem
						name={"Academy"}
						active={false}
						icon={<img src="../icons/contacts.svg" />}
						onClick={() => {}}
					/> */}
				</MenuItemGroup>
				<MenuItemGroup>
					<div class="bg-black/[0.08] w-full h-[1px] rounded-xl mb-[16px]" />
					<MenuItemTitle
						active={false}
						name={"Groups"}
						onClick={console.log}
						// onClickPlus={async () => {
						// 	console.log
						// }}
					/>
					<Show when={!!state.groups_joined}>
						<div
							class=""
							classList={{
								"opacity-50": feedState.feedLoading,
							}}
						>
							{feedState.feedLoading ? (
								<div
									class={`absolute h-[200px] w-[200px] flex items-center justify-center content-center`}
								>
									<LoadingIcon class="w-5 h-5" />
								</div>
							) : null}
							<For each={state.groups_joined}>
								{(group) => (
									<GroupItem
										name={group.name}
										src={group?.logo ? group.logo : null}
										active={feedState.selectedGroup === group.id}
										onClick={() => {
											if (!feedState.feedLoading) setSelectedGroup(group.id)
										}}
									/>
								)}
							</For>
						</div>
					</Show>
				</MenuItemGroup>

				{/* <MenuItemGroup>
					<MenuItemSearch
						active={false}
						name={"Archived"}
						onClick={console.log}
						onClickSearch={async () => {
							console.log
						}}
					/>
				</MenuItemGroup> */}
			</AppMenuBody>
		</AppMenu>
	)
}
