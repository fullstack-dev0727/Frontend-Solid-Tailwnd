import { ParentProps } from "solid-js";


export const IconFrame = (props: ParentProps<{}>) => {
    return <div class="w-4 h-4 flex items-center justify-center gap-x-4">
        {props.children}
    </div>
}

export const IconContainer = (props: ParentProps<{}>) => {
    return <div class="w-4 h-4 flex items-center justify-center">
        <IconFrame>
            {props.children}
        </IconFrame>
    </div>
}
