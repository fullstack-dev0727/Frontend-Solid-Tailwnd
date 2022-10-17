import {
	ParentComponent,
} from "solid-js"
import { EditIcon } from "../icons"

type EditIconButtonProps = {
	active: boolean
	onClick: () => void
}

export const EditIconButton: ParentComponent<EditIconButtonProps> = (props) => {

	return (
		<div
			onclick={props.onClick}
			class={`group border-2 border-[#4EADF1] cursor-pointer rounded-[16px] flex w-[72px] h-[32px] px-[12px] bg-white active:bg-[#3B88BF] active:border-[#3B88BF] hover:bg-[#4EADF1]`}
		>
			<div class={`my-auto fill-blue-500`}>
				<EditIcon size={() => 16} />
			</div>
			<div
				class={`ml-[6px] my-auto text-[13px] leading-[16px] font-[Inter] font-medium text-[#4EADF1] group-active:text-[white] group-hover:text-white`}
			>
				Edit
			</div>
		</div>
	)
}
