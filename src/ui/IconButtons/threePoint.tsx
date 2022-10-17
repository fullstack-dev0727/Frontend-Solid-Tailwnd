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

const ThreePointButton = (props: IconOptions) => {
    return (
        <div>
            <button class="flex">
                <svg class="m-auto" width="14" height="3" viewBox="0 0 14 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.61538 3C1.18696 3 0.776079 2.84196 0.473135 2.56066C0.170192 2.27936 0 1.89782 0 1.5C0 1.10218 0.170192 0.720644 0.473135 0.43934C0.776079 0.158035 1.18696 0 1.61538 0C2.04381 0 2.45469 0.158035 2.75763 0.43934C3.06058 0.720644 3.23077 1.10218 3.23077 1.5C3.23077 1.89782 3.06058 2.27936 2.75763 2.56066C2.45469 2.84196 2.04381 3 1.61538 3ZM7 3C6.57157 3 6.16069 2.84196 5.85775 2.56066C5.55481 2.27936 5.38462 1.89782 5.38462 1.5C5.38462 1.10218 5.55481 0.720644 5.85775 0.43934C6.16069 0.158035 6.57157 0 7 0C7.42843 0 7.83931 0.158035 8.14225 0.43934C8.44519 0.720644 8.61539 1.10218 8.61539 1.5C8.61539 1.89782 8.44519 2.27936 8.14225 2.56066C7.83931 2.84196 7.42843 3 7 3ZM12.3846 3C11.9562 3 11.5453 2.84196 11.2424 2.56066C10.9394 2.27936 10.7692 1.89782 10.7692 1.5C10.7692 1.10218 10.9394 0.720644 11.2424 0.43934C11.5453 0.158035 11.9562 0 12.3846 0C12.813 0 13.2239 0.158035 13.5269 0.43934C13.8298 0.720644 14 1.10218 14 1.5C14 1.89782 13.8298 2.27936 13.5269 2.56066C13.2239 2.84196 12.813 3 12.3846 3Z" fill="black" fill-opacity="0.8"/>
                </svg>
            </button>
        </div>
    )
}

export default ThreePointButton
