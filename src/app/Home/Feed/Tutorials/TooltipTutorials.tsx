import { tutorialsGet } from "@/app/AIStudio/Editor/Editor"
import { currentFolder } from "@/app/AIStudio/state"
import { createSignal, For, JSXElement, Ref, Show } from "solid-js"
import { aiStudioTutorial, editorTutorial, tutorials } from "./types"


export const [firstTimeUser, setFirstTimeUser] = createSignal(false)
export const [tutorialComplete, setTutorialComplete] = createSignal(false)
export const [minimized, setMinimized] = createSignal(false)

export const [tutorialIndex, setTutorialIndex] = createSignal(0)
export const modes = [
    "collapsed",
    "expanded",
] as const;

export const MinimizedTutorial = (props: {
    onClick?: () => void
}) => {
    return (
        <div class="group absolute top-1 right-32 w-[40px] h-[40px] bg-[#EEEEEE] flex items-center justify-center rounded-[50%] font-[500] cursor-pointer shadow-[0px_4px_24px_rgba(0,0,0,0.16)]" onClick={props.onClick}>
            <div class="h-full w-full">
                <img src="/don.png" class="object-cover rounded-[50%] h-full w-full" />
            </div>
            {/* <Button text="Open" onClick={props.onClick} /> */}
            <div class="absolute top-10 flex-col items-center hidden group-hover:flex w-6 h-6">
                <span class="relative z-10 w-[100px] p-3 text-xs leading-none text-white bg-black shadow-lg rounded-md">Click to watch again!</span>
            </div>
        </div>
    )
}


export const TooltipTutorials = (props: {
    onClick?: () => void,
    cancel?: boolean,
    onSubmit?: () => void,
    onCancel?: () => void,
    height?: string,
    width?: string,
    isAiStudio?: boolean,
    minimize?: () => void
}) => {

    console.log(tutorialsGet)

    return (
        <div class={`flex flex-col z-[1] h-auto ${props.isAiStudio ? "w-[394px]" : "w-[508px]"} px-[16px] gap-[12px] rounded-[24px] py-[16px] shadow-[0px_4px_24px_rgba(0,0,0,0.16)] bg-[#FFFFFF] animate-fade-in-down`}>
            <div class="flex flex-col gap-[16px]">
                <User name="Don Bosco" userName="Don" src="/don.png" />
                <Video src={props.isAiStudio ? aiStudioTutorial.videoUrl : editorTutorial[tutorialIndex()].videoUrl} />
                <Show when={!props.isAiStudio}>
                    <Menu />
                    <hr class="bg-[#D2D2D7] h-[1px]" />
                </Show>
                <Body title={props.isAiStudio ? aiStudioTutorial.title : editorTutorial[tutorialIndex()]?.title} content={props.isAiStudio ? aiStudioTutorial.body : editorTutorial[tutorialIndex()]?.body} />
            </div>

            <hr class="bg-[#D2D2D7] h-[1px] " />
            <div class="flex items-center justify-between">
                <Social likes="500" />
                <Button text={`${editorTutorial[tutorialIndex()].menuItem === "Audio" ? "Finish" : "Okay"}`}
                    onClick={() => {
                        if (editorTutorial[tutorialIndex()].menuItem !== "Audio") {
                            setTutorialIndex(tutorialIndex() + 1)
                        }
                        else {
                            props.minimize()
                        }
                    }} />
            </div>
        </div>
    )
}


export const User = (props: {
    src?: string,
    name?: string,
    userName?: string
}) => {
    return (
        <div class={`flex items-center gap-[8px] `}>
            <img src={props.src} class={`rounded-[50%] w-[40px] h-[40px] object-cover`} />
            <div class="flex gap-[2px] font-[600] text-[15px] ">
                <span>
                    {props.name}
                </span>
                <span class="text-[#494949]">
                    @{props.userName}
                </span>
            </div>
        </div>
    )
}

export const Video = (props: {
    src?: string,
}) => {
    return (
        <div class="h-[279px]">
            <video src={props.src} class="rounded-[24px] object-contain w-[476px] h-[279px]" controls autoplay={currentFolder() !== undefined} />
        </div>
    )
}

export const Body = (props: {
    height?: string,
    width?: string,
    title?: string,
    content?: JSXElement
}) => {
    return (
        <div class={`h-[${props.height}px] flex flex-col gap-[4px] `}>
            <p class="font-[600] text-[17px] leading-[22px] text-[#1D1D1F]">{props.title}</p>
            <p class="text-[15px] leading-[22.5px]">{props.content}</p>
        </div>
    )
}

export const Social = (props: {
    height?: string,
    width?: string,
    likes?: string
}) => {
    return (
        <div class={`flex items-center gap-[6px]`}>
            <div class="flex items-center w-[20px] h-[20px]">

                <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.25008 1.33331C3.71883 1.33331 1.66675 3.3854 1.66675 5.91665C1.66675 10.5 7.08341 14.6666 10.0001 15.6358C12.9167 14.6666 18.3334 10.5 18.3334 5.91665C18.3334 3.3854 16.2813 1.33331 13.7501 1.33331C12.2001 1.33331 10.8292 2.1029 10.0001 3.28081C9.57745 2.67882 9.01598 2.18752 8.36322 1.84852C7.71046 1.50952 6.98562 1.33279 6.25008 1.33331Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </div>

            <div class="text-[13px] font-[400]">{props.likes}</div>
        </div>
    )
}

export const Button = (props: {
    text?: string
    onClick?: () => void
    tutorial?: tutorials
}) => {
    return (
        <div class={`w-[85px] h-[36px] rounded-[24px] bg-[#0095F8] flex items-center justify-center cursor-pointer text-[15px] font-[500] leading-[20] text-white`}
            onClick={() => props.onClick()}
        >
            {props.text}
        </div>
    )
}




export const Avatar = (props: {
    src?: string[],
}) => {

    const [src, setSrc] = createSignal(props.src)
    setSrc([
        "/avatar1.png",
        "/avatar2.png",
        "/avatar3.png",
        "/avatar4.png",
    ])
    return (
        <div class=" flex ">
            {src()?.map((item, index) => {
                return (
                    <img class={`w-8 h-8 rounded-[50%] ${index === 0 ? "" : "-ml-4"} object-fill`} src={item} alt="" />
                )
            })}
        </div>
    )
}

const Menu = (props: {
}) => {
    let scrollRef: Ref<any>;
    return (
        <div class={`flex flex-row items-center gap-[8px] w-[476px]`}>
            <div class="flex flex-row h-[32px] items-center justify-start gap-[8px] px-[8px] overflow-x-scroll no-scrollbar overflow-y-hidden scroll-smooth" ref={scrollRef}>
                <For each={editorTutorial}>{(item, index) => {
                    return (
                        <div class={`flex px-[8px] py-[4px] h-[24px] leading-[14px] text-[17px] font-[500] justify-center items-center cursor-pointer ${(editorTutorial[tutorialIndex()]?.menuItem === item.menuItem) ? "text-[#1D1D1F]" : "text-[#86868B]"} hover:text-[#1D1D1F]`}
                            onClick={() => { setTutorialIndex(index) }}>
                            {item.menuItem}
                        </div>
                    )
                }}
                </For>
            </div>
        </div>
    )
}



