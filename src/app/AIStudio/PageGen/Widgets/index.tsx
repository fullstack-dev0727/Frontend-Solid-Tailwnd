import { Component, For, JSX } from "solid-js";

import {
    createDraggable,
} from "@thisbeyond/solid-dnd";
import { CalendlyIcon, HtmlIcon, ImageIcon, TextBoxIcon, TextIcon, TitleIcon, VideoIcon } from "@/ui/IconButtons/PageGen/widgets";

type WidgetTypes = "video" | "text" | "title" | "input" | "html" | "image" | "calendly" | "clipboard";

import { Title } from './Title';
import { Text } from './Text';
import { Image } from './Image';
import { Calendly } from './Calendly';
import { Input } from './Input';
import { Html } from './Html';
import { GeneratedVideo } from './GeneratedVideo';
import { currentSettings } from "../../state";
// import { Text } from './Text';

interface WidgetProps {
    id: string,
    data: string,
    emojiEnabled: boolean,
    commentsEnabled: boolean,
}

interface Widget<P = WidgetProps> {
    name: WidgetTypes;
    icon: JSX.Element;
    component: Component<P>;
}

export const widgetsList: Widget[] = [
    { name: "title", icon: <TitleIcon />, component: (p) => <Title id={p.id} data={p.data} /> },
    { name: "text", icon: <TextIcon />, component: (p) => <Text id={p.id} data={p.data} /> },
    { name: "video", icon: <VideoIcon />, component: (p) => <GeneratedVideo id={p.id} emojiEnabled={p.emojiEnabled} /> },
    { name: "input", icon: <TextBoxIcon />, component: (p) => <Input id={p.id} data={p.data}></Input> },
    { name: "html", icon: <HtmlIcon />, component: (p) => <Html id={p.id} data={p.data} /> },
    { name: "image", icon: <ImageIcon />, component: (p) => <Image id={p.id} data={p.data} /> },
    { name: "calendly", icon: <CalendlyIcon />, component: (p) => <Calendly id={p.id} data={p.data} /> },
    // { name: "clipboard", icon: <ClipBoardIcon />, component: (p: WidgetProps) => <textarea></textarea> },
];


export const Widgets = () => {

    return (
        <For each={widgetsList}>
            {(item, i) => {
                let draggable: any = () => { };
                if (!currentSettings()?.vimeo_enabled) {
                    draggable = createDraggable(item.name);
                }
                return (
                    <div id={`${item.name}-${i()}-container`} class="pr-10">
                        <div id={`${item.name}-${i()}`} use:draggable>
                            {item.icon}
                        </div>
                    </div>
                )
            }}
        </For>
    )
};