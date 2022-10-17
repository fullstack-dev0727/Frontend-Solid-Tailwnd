import { ParentComponent } from "solid-js"

export const AppMenu: ParentComponent = (props) => {
	return (
		<div class="bg-black/[0.06] w-60 border-r-[#0000000F] border-r flex gap-4 flex-col">
			{props.children}
		</div>
	)
}
