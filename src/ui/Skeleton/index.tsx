import { ParentProps } from "solid-js";

export const Skeleton = (props: ParentProps<{gap?: string}>) => {
    return <div class={`animate-pulse flex flex-col ${props.gap || "gap-2"}`}>
        {props.children}
    </div>
}

export const SkeletonBox = (props: {
    width?: string,
    height?: string
}) => {
    return <div class="bg-gray-200 rounded" style={{
        width: props.width || "100%",
        height: props.height || "40px"
    }}>

    </div>
}

export const SkeletonFlex = (props: ParentProps<{
    col?: boolean,
    gap?: string,
    center?: boolean,
    width?: string
}>) => {
    return <div class={`flex ${props.col ? "flex-col" : ""} ${props.gap || "gap-2"} ${props.center ? "justify-center items-center" : ""}`} style={{
        width: props.width || "100%"
    }}>
        {props.children}
    </div>
}