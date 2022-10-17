import { createSignal, Show } from "solid-js";

import html from 'solid-js/html';
import h from 'solid-js/h';
import { Dynamic } from "solid-js/web";
import { updateWidget } from "../../state";

export const Html = (props: {data: string, id: string}) => {

    const [isEdit, setIsEdit] = createSignal<boolean>(false);

    const [text, setText] = createSignal<string>(props.data != "" ? props.data : "<div><p>Example html here</p></div>");

    return (<div>
        <Show when={isEdit()}>
            <input placeholder="your html here" value={text()} onblur={(e) => { setText(e.currentTarget.value); updateWidget(props.id,e.currentTarget.value); setIsEdit(!isEdit()) }}></input>
        </Show>
        <Show when={!isEdit()}>
            <div onclick={() => setIsEdit(!isEdit())}>
                HTML Embed
                {/* <Show when={text() != ""}>
            </Show> */}
            </div>
        </Show>
    </div>
    )
}
