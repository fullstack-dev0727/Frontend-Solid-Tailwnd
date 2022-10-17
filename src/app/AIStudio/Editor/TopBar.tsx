import { ChevronLeftIcon } from "@/ui/icons"
import { useNavigate } from "solid-app-router"
import { Component } from "solid-js"
import { ConnectedUsers } from "./ConnectedUsers"

export const TopBar: Component<{ name: string }> = (props) => {
	return (
		<>
			<div class="flex justify-between items-center px-[1rem] py-[10px] bg-[#00000000] h-[48px] bg-black/0">
				<div
					class="cursor-pointer "
					onClick={navigateBack()}
				>
					<ChevronLeftIcon size={12} />
				</div>
				<span class="text-[15px] font-[Inter] font-normal w-full h-[18px] my-auto ml-[6px] mr-[12px] leading-[18px] overflow-hidden text-ellipsis whitespace-nowrap text-center">
					{props.name}
				</span>
				<div class="flex gap-2">
					<ConnectedUsers />
					{/* <button class="cursor-pointer flex justify-center rounded-full w-[65px] bg-[#4EADF1] py-2 px-2 text-[13px] font-[13px] font-semibold text-white font-[Inter] flex items-center gap-2 hover:bg-[#3A9AE0] duration-75">
						Share
					</button> */}
				</div>
			</div>
			<div class="bg-black/[0.08] w-full h-[1px] rounded-xl"></div>
		</>
	)
}

const navigateBack = () => {
	const navigate = useNavigate()

	return () => {
		navigate("./")
	}
}
