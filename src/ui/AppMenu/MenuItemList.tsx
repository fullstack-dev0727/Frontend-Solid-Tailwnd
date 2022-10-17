import { ParentComponent } from "solid-js"

export const MenuItemList: ParentComponent = (props) => {
	return <div class="flex flex-col gap-0.5">{props.children}</div>
}
