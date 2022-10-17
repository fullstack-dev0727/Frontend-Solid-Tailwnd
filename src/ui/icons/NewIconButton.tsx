import {
    children as solidifyChildren,
    ComponentProps,
    createSignal,
    ParentProps,
    splitProps,
} from "solid-js"

type NewIconButtonProps<P = {}> = P & {
    name: string,
    styled?: boolean
}

export const NewIconButton = (
    props: ParentProps<NewIconButtonProps<ComponentProps<"div">>>
) => {
    const children = solidifyChildren(() => props.children)
    const [local, { name, ...others }] = splitProps(props, ["class", "styled", "children"])
    const [active, setActive] = createSignal(false);


    const onClick = (() => {
        console.log(active())
        setActive(!active());
    });

    
    const CamearaActive = () => {
        return (<div>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 3.93909C0 1.76359 1.76359 0 3.93909 0H7.67513C9.85063 0 11.6142 1.76359 11.6142 3.93909V7.67513C11.6142 9.85063 9.85062 11.6142 7.67513 11.6142H3.93909C1.76359 11.6142 0 9.85062 0 7.67513V3.93909ZM3.93909 1.38071C2.52613 1.38071 1.38071 2.52613 1.38071 3.93909V7.67513C1.38071 9.08808 2.52613 10.2335 3.93909 10.2335H7.67513C9.08808 10.2335 10.2335 9.08808 10.2335 7.67513V3.93909C10.2335 2.52613 9.08808 1.38071 7.67513 1.38071H3.93909Z" fill="white" fill-opacity="0.9"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.6192 4.7806C14.6192 4.08627 13.8885 3.63468 13.2675 3.94519L12.1304 4.51372C11.814 4.67194 11.6141 4.99535 11.6141 5.34913V6.26516C11.6141 6.61893 11.814 6.94235 12.1304 7.10056L13.2675 7.66909C13.8885 7.9796 14.6192 7.52801 14.6192 6.83368V4.7806ZM12.65 2.71025C14.1891 1.94072 15.9999 3.05988 15.9999 4.7806V6.83368C15.9999 8.55441 14.1891 9.67356 12.65 8.90403L11.5129 8.33551C10.7288 7.94341 10.2334 7.14191 10.2334 6.26516V5.34913C10.2334 4.47237 10.7288 3.67087 11.5129 3.27878L12.65 2.71025Z" fill="white" fill-opacity="0.9"/>
            </svg>
        </div>)
    }
    
    return (
        <div onclick={onClick} class={`group flex h-[28px] w-[67px] pl-[5px] pr-[5px] cursor-pointer justify-between rounded-[14px] transition-all duration-200 bg-[#4EADF1]/100 
            ${active() ? 'bg-[#3B88BF]/100' : ''} hover:bg-[#4EADF1]/[0.9]`}>
            
            <div class="visible flex items-center m-auto">
                <CamearaActive />
            </div>
            <div class={`text-[13px] text-white font-semibold m-auto`}>
                {name}
            </div>
            
        </div>

    )
}
