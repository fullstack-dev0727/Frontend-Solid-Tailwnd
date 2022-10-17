import { ParentComponent } from "solid-js"

export const MenuItemGroup: ParentComponent = (props) => {
	return <div class="flex flex-col gap-1">{props.children}</div>
}
