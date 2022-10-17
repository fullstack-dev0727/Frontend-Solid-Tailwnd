import {
    Accessor,
    ComponentProps,
    PropsWithChildren,
    Setter,
    Show,
} from "solid-js"

type SvgOptions = PropsWithChildren<ComponentProps<"svg">>
type SvgWithIconsOptions<P = {}> = P & {
    type?: "solid" | "outline"
}

type PlayStateWithButton<P = {}> = P & {
    state: Accessor<boolean>
    setState: Setter<boolean>
    colors?: [
        {
            stroke: string
            fill: string
        },
        {
            stroke: string
            fill: string
        }
    ]
    width?: number
    height?: number
}

type IconOptions = SvgWithIconsOptions<SvgOptions>
type ButtonOptions = PlayStateWithButton<ComponentProps<"button">>

const SearchButton = (props: IconOptions) => {
    return (
        <div class="w-[24px] h-[24px] flex">
            <svg class="m-auto" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.59505 7.73908L11.8229 10.967C11.9363 11.0805 12.0001 11.2345 12 11.395C11.9999 11.5555 11.9361 11.7094 11.8226 11.8229C11.7091 11.9363 11.5551 12.0001 11.3946 12C11.2341 11.9999 11.0802 11.9361 10.9667 11.8226L7.73889 8.59466C6.77396 9.34205 5.56055 9.69376 4.34552 9.57825C3.13049 9.46274 2.00509 8.88867 1.19828 7.97284C0.391468 7.05701 -0.0361574 5.86821 0.00239768 4.64827C0.0409527 3.42834 0.542792 2.26891 1.40582 1.40586C2.26886 0.542805 3.42825 0.0409537 4.64816 0.00239774C5.86806 -0.0361583 7.05683 0.391478 7.97264 1.19831C8.88845 2.00514 9.4625 3.13056 9.57801 4.34563C9.69352 5.56069 9.34242 6.77413 8.59505 7.73908ZM4.80022 8.39966C5.75496 8.39966 6.67059 8.02039 7.34569 7.34527C8.02079 6.67016 8.40005 5.7545 8.40005 4.79974C8.40005 3.84498 8.02079 2.92933 7.34569 2.25421C6.67059 1.5791 5.75496 1.19982 4.80022 1.19982C3.84549 1.19982 2.92986 1.5791 2.25476 2.25421C1.57966 2.92933 1.20039 3.84498 1.20039 4.79974C1.20039 5.7545 1.57966 6.67016 2.25476 7.34527C2.92986 8.02039 3.84549 8.39966 4.80022 8.39966Z" fill="black" fill-opacity="0.8"/>
            </svg>
        </div>
    )
}

export default SearchButton
