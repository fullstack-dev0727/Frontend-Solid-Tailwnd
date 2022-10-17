import { ParentComponent } from "solid-js"
import { Scrollable } from "../Scrollable"

export const AppMenuBody: ParentComponent = (props) => {
	return <Scrollable>
		<div class="flex flex-col gap-6 p-2 h-[calc(100vh_-_60px)]">{props.children}</div>
	</Scrollable>
}
