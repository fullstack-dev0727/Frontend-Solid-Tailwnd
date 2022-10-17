import { SearchIcon } from "@/ui/icons/SearchIcon"

export const Search = (props: {
	onInput?: (element: HTMLInputElement) => void
}) => {
	return (
		<div class="flex items-center h-10 bg-[#0000000F]">
			<div class="flex p-4">
				<SearchIcon size={12} />
			</div>
			<input class="w-full h-full appearance-none outline-none bg-transparent rounded-none font-[Inter]" placeholder="Search contacts" onInput={(ev) => {
				props.onInput(ev.target as HTMLInputElement);
			}} />
		</div>
	)
}
