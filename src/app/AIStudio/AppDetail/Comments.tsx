import { useParams, useLocation } from "solid-app-router"
import { For, createSignal } from "solid-js"

export const Comments = () => {
	const [commentList, setCommentList] = createSignal([
		{
			id: "J---aiyznGQ",
			userName: "Don Bosco",
			userPhoto: "/images/userdefault.png",
			time: "26 min ago",
			comment: "Wow I really like this product. How can I get it?",
		},
		{
			id: "z_AbfPXTKms",
			userName: "Marga Be",
			userPhoto: "/images/userdefault.png",
			time: "25 min ago",
			comment:
				"Wow I really like this product. I really like this product. This is very good. I really like this product. This is very good. I really like this product. This is very good. How can I get it?",
		},
	])
	const count = commentList().length

	return (
		<div class="bg-black/[0.04] rounded-[16px] p-[16px] select-text">
			<div class="text-[17x] leading-[24px] font-[Inter] flex">
				<div class="text-black/[0.9] font-semibold">Comments</div>
				<div class="ml-[4px] text-black/[0.6] font-normal ">{count}</div>
				<div class="text-[15px] leading-[18px] font-medium text-black/[0.9] mr-0 ml-auto cursor-pointer ">
					See all
				</div>
			</div>
			<div class="mt-[16px] grid gap-6">
				<For each={commentList()}>
					{(item, i) => (
						<div class="hover:bg-black/[0.06] w-full rounded-[12px] flex p-[8px]">
							<img
								src={`${item.userPhoto}`}
								alt=""
								class={`w-[32px] h-[32px] pointer-events-none rounded-full`}
							/>
							<div class="ml-[8px]">
								<div class="flex">
									<div class="font-[Inter] text-[15px] font-semibold leading-[18px] text-black/[0.9]">
										{item.userName}
									</div>
									<div class="w-[2px] h-[2px] rounded-full my-auto mx-[6px] bg-black/[0.6]"></div>
									<div class="font-[Inter] text-[13px] font-normal leading-[16px] text-black/[0.6]">
										{item.time}
									</div>
								</div>
								<div class="mt-[6px] font-[Inter] text-[15px] font-normal leading-[150%] text-black/[0.9] line-clamp-2">
									{item.comment}
								</div>
							</div>
						</div>
					)}
				</For>
			</div>
		</div>
	)
}

export default Comments
