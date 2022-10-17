import {
    children as solidifyChildren,
    ComponentProps,
    createSignal,
    PropsWithChildren,
    splitProps,
} from "solid-js"

type VideoInstanceProps<P = {}> = P & {
    name: string,
    styled?: boolean
}

export const VideoInstance = (
    props: PropsWithChildren<VideoInstanceProps<ComponentProps<"div">>>
) => {
    const children = solidifyChildren(() => props.children)
    const [local, { name, ...others }] = splitProps(props, ["class", "styled", "children"])
    const [active, setActive] = createSignal(false);

    const onClick = (() => {
        console.log(active())
        setActive(!active());
    });

    
    return (
        <div onclick={onClick} class={`group inline pr-[12px] pl-[12px] cursor-pointer rounded-[8px] px-1`}>
            <div class="p-[2px] inline-block mx-auto">
                <img src={`${'/images/item_icon.png'}`} alt="" class={`w-[86px] h-[86px] m-auto pointer-events-none rounded-[8px] ${active() ? 'border-2 border-[#4EADF1]/[12]' : ''}`}/>  
            </div>
            
            <div class={`w-[120px] h-[48px] my-[2px] text-center rounded-[8px] flex p-[4px] bg-black/0 ${active() ? 'bg-black/[0.1]' : ''} group-hover:bg-black/[0.06]`}>
                <div class={`text-[13px] leading-[150%] font-[Inter] text-black/[0.6] font-medium line-clamp-2 ${active() ? 'text-black/[0.9]' : ''} group-hover:text-black/[0.9]`}>{name}</div>
            </div>
            
        </div>

    )
}
