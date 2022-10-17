import {
    children as solidifyChildren,
    ComponentProps,
    createSignal,
    PropsWithChildren,
    splitProps,
} from "solid-js"
import { ThreePointIconButton } from "../icons/ThreePointIconButton"
import { NewIconButton } from "../icons/NewIconButton"

type VideoInstanceBarProps<P = {}> = P & {
    name: string,
    styled?: boolean
}

export const VideoInstanceBar = (
    props: PropsWithChildren<VideoInstanceBarProps<ComponentProps<"div">>>
) => {
    const children = solidifyChildren(() => props.children)
    const [local, { name, ...others }] = splitProps(props, ["class", "styled", "children"])

    const FolderIcon = () => {
        return (<div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6H11L9 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H19.5C20.35 20 21 19.35 21 18.5V8C21 6.9 20.1 6 19 6Z" fill="#1976D2"/>
                <path d="M21.1 9H7.65C6.7 9 5.85 9.7 5.7 10.65L4 20H19.85C20.8 20 21.65 19.3 21.8 18.35L23.05 11.35C23.3 10.15 22.35 9 21.1 9Z" fill="#90CAF9"/>
            </svg>
        </div>)
    }
    return (
        <div class={`flex h-12 w-full cursor-pointer p-[12px] bg-black/0 `}>
            <FolderIcon />
            <div class="text-[15px] font-[Inter] font-semibold w-full h-[18px] my-auto ml-[6px] mr-[12px] leading-[18px] overflow-hidden text-ellipsis whitespace-nowrap">{name}</div>
            <div class="mr-[12px] ml-auto">
                <ThreePointIconButton />
            </div>
            <div class="mr-0 ml-auto">
                <NewIconButton name="New" />
            </div>
        </div>

    )
}
