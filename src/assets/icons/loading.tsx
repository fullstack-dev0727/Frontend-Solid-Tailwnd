import {
	Accessor,
	ComponentProps,
	Show,
	children,
	splitProps,
	ParentProps,
} from "solid-js"
import { LoadingIcon, IconProps } from "./index"

type LoadingProps<T = {}> = T & {
	state: Accessor<boolean>
}

export const IconWithLoading = (
	props: LoadingProps<IconProps<ParentProps<ComponentProps<"svg">>>>
) => {
	const [_, others] = splitProps(props, ["state"])
	return (
		<>
			<Show
				when={!props.state()}
				fallback={<LoadingIcon {...others} />}
			>
				{children(() => props.children)()}
			</Show>
		</>
	)
}
