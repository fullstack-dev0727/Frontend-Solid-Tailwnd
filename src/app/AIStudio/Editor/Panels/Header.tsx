import { modes } from "@/app/Home/Feed/Tutorials/TooltipTutorials";
import { Component, createEffect, createSignal, For, Match, on, Show, Switch } from "solid-js";
import { PanelData, ProviderGetSet } from "./types";

export const Header: Component<PanelData & ProviderGetSet> = (props) => {
	const [mode, setMode] = createSignal(modes);

	createEffect(on([() => props.mode], () => {
		switch (props.mode) {
			case "maximized": {
				const filtered = modes.filter((m: string) => m !== "collapsed") as unknown as typeof modes;
				setMode(filtered);
			}
				break;
			case "minimized": {
				const filtered = modes.filter((m: string) => m !== "expanded") as unknown as typeof modes;
				setMode(filtered);
			}
				break;
			case "collapsed": {
				const filtered = modes.filter((m: string) => m !== "minimized") as unknown as typeof modes;
				setMode(filtered);
			}
				break;
			default: {
				const filtered = modes.filter((m: string) => m !== "minimized") as unknown as typeof modes;
				setMode(filtered);
			}
		}
	}))

	return (
		<div
			class="flex justify-between gap-2 items-center px-2"
			onPointerDown={(e) => {
				e.preventDefault();
				props.set("left0", props.rect.left);
				props.set("top0", props.rect.top);
				props.set("right0", props.rect.right);
				props.set("bottom0", props.rect.bottom);
				props.set("x0", e.x);
				props.set("y0", e.y);
			}}
		>
			<div class="font-[500]">{props.title}</div>
			<div class="flex gap-2 items-center justify-center py-2">
				<For each={mode()}>
					{(mode) => {
						return (
							<Show when={props.mode !== mode}>
								<button onClick={() => props.set("panels", 0, "mode", mode)}>
									<div class="h-full w-[24px]">
										<img src={`/icons/${mode}.svg`} />
									</div>
								</button>
							</Show>
						)
					}
					}
				</For>
			</div>
		</div >
	);
};