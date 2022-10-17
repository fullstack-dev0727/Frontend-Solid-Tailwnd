import { useNavigate } from "solid-app-router"
import {
	children as solidifyChildren,
	ComponentProps,
	createSignal,
	ParentProps,
	splitProps,
	For,
	createEffect,
} from "solid-js"
import { currentTabs, Tab } from "./state"


import {state} from '../state'

import { TabItem } from "./TabItem"
type TabsProps<P = {}> = P & {
	appList: Tab[]
	currentTap: any
	styled?: boolean
}

export const Tabs = (
	props: ParentProps<TabsProps<ComponentProps<"div">>>
) => {
	// const children = solidifyChildren(() => props.children)
	// const [local, { appList, currentTap, ...others }] = splitProps(props, [
	// 	"class",
	// 	"styled",
	// 	"children",
	// ])

	const [selTab, setSelTab] = createSignal("Overview")
	// const isCurentTab = createSelector(selTab);

	const navigate = useNavigate()
	if (props.currentTap) setSelTab(props.currentTap.name)
	console.log("appList!", props.appList)
	const tapClick = (_index: any) => {
		navigate(props.appList[_index].routeUrl)
		setSelTab(props.appList[_index].name)
		console.log("tapClick click!", selTab())
	}

	return (
		<div class={`px-[16px] pb-[15px] pt-[24px]`}>
			<div class="flex flex-wrap gap-6">
				<For each={props.appList}>{(app, ind) => {
					return <TabItem
						name={app.name}
						count={app.count}
						index={0}
						active={selTab() == app.name}
						onClick={() => tapClick(ind())}
					/>
				}}</For>
			</div>
			<div class="bg-black/[0.08] w-full h-[1px] mt-[12px]"></div>
		</div>
	)
}
