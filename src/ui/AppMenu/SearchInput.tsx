import {
    children as solidifyChildren,
    ComponentProps,
    createSignal,
    PropsWithChildren,
    splitProps,
} from "solid-js"

type SearchInputProps<P = {}> = P & {
    name: string,
    styled?: boolean
}

export const SearchInput = (
    props: PropsWithChildren<SearchInputProps<ComponentProps<"div">>>
) => {
    const children = solidifyChildren(() => props.children)
    const [local, { name, ...others }] = splitProps(props, ["class", "styled", "children"])
    const [active, setActive] = createSignal(false);


    const onClick = (() => {
        console.log(active())
        setActive(!active());
    });

    const activeClass = () => active() ? 'bg-black/[0.1]' : '';

    const Search = () => {
        return (<div>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.59505 7.73908L11.8229 10.967C11.9363 11.0805 12.0001 11.2345 12 11.395C11.9999 11.5555 11.9361 11.7094 11.8226 11.8229C11.7091 11.9363 11.5551 12.0001 11.3946 12C11.2341 11.9999 11.0802 11.9361 10.9667 11.8226L7.73889 8.59466C6.77396 9.34205 5.56055 9.69376 4.34552 9.57825C3.13049 9.46274 2.00509 8.88867 1.19828 7.97284C0.391468 7.05701 -0.0361574 5.86821 0.00239768 4.64827C0.0409527 3.42834 0.542792 2.26891 1.40582 1.40586C2.26886 0.542805 3.42825 0.0409537 4.64816 0.00239774C5.86806 -0.0361583 7.05683 0.391478 7.97264 1.19831C8.88845 2.00514 9.4625 3.13056 9.57801 4.34563C9.69352 5.56069 9.34182 6.77413 8.59445 7.73908H8.59505ZM4.80022 8.39966C5.75496 8.39966 6.67059 8.02039 7.34569 7.34527C8.02079 6.67016 8.40005 5.7545 8.40005 4.79974C8.40005 3.84498 8.02079 2.92933 7.34569 2.25421C6.67059 1.5791 5.75496 1.19982 4.80022 1.19982C3.84549 1.19982 2.92986 1.5791 2.25476 2.25421C1.57966 2.92933 1.20039 3.84498 1.20039 4.79974C1.20039 5.7545 1.57966 6.67016 2.25476 7.34527C2.92986 8.02039 3.84549 8.39966 4.80022 8.39966Z" fill="black" fill-opacity="0.6"/>
            </svg>

        </div>)
    }
    
    const SearchActive = () => {
        return (<div>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.59505 7.73908L11.8229 10.967C11.9363 11.0805 12.0001 11.2345 12 11.395C11.9999 11.5555 11.9361 11.7094 11.8226 11.8229C11.7091 11.9363 11.5551 12.0001 11.3946 12C11.2341 11.9999 11.0802 11.9361 10.9667 11.8226L7.73889 8.59466C6.77396 9.34205 5.56055 9.69376 4.34552 9.57825C3.13049 9.46274 2.00509 8.88867 1.19828 7.97284C0.391468 7.05701 -0.0361574 5.86821 0.00239768 4.64827C0.0409527 3.42834 0.542792 2.26891 1.40582 1.40586C2.26886 0.542805 3.42825 0.0409537 4.64816 0.00239774C5.86806 -0.0361583 7.05683 0.391478 7.97264 1.19831C8.88845 2.00514 9.4625 3.13056 9.57801 4.34563C9.69352 5.56069 9.34242 6.77413 8.59505 7.73908ZM4.80022 8.39966C5.75496 8.39966 6.67059 8.02039 7.34569 7.34527C8.02079 6.67016 8.40005 5.7545 8.40005 4.79974C8.40005 3.84498 8.02079 2.92933 7.34569 2.25421C6.67059 1.5791 5.75496 1.19982 4.80022 1.19982C3.84549 1.19982 2.92986 1.5791 2.25476 2.25421C1.57966 2.92933 1.20039 3.84498 1.20039 4.79974C1.20039 5.7545 1.57966 6.67016 2.25476 7.34527C2.92986 8.02039 3.84549 8.39966 4.80022 8.39966Z" fill="black" fill-opacity="0.8"/>
            </svg>
        </div>)
    }
    
    return (
        <div onclick={onClick} class={`group flex h-7 w-56 pr-[12px] pl-[12px] cursor-pointer justify-between rounded-[8px] px-1 transition-all duration-200 bg-black/[0.06] hover:bg-black/[0.1] active: ${activeClass()}`}>
            <div class="visible flex items-center group-hover:visible group-active:visible">
                <div class={`opacity-[0.6] group-hover:opacity-100 ${active() ? 'opacity-100' :''}`}>
                    <SearchActive />
                </div>
            </div>
            <div class="flex items-center space-x-2 mr-auto ml-[8px]">
                <span class={`text-[13px] font-[Inter] text-black/[0.6] font-medium ${active() ? 'text-black/[0.9]' : ''} group-hover:text-black/[0.9]`}>{name}</span>
            </div>
            
        </div>

    )
}
