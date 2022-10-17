import { createSignal, Show } from "solid-js";
import { updateWidget } from "../../state";

export const Text = (props: { data: string, id: string }) => {

    const [isEdit, setIsEdit] = createSignal<boolean>(false);

    console.log("TEXT:",props.data)

    const [text, setText] = createSignal<string>(props.data != "" ? props.data : "Text");

    return (<div>
        <Show when={isEdit()}>
            <input placeholder="your text here" value={text()} onblur={(e) => { setText(e.currentTarget.value); updateWidget(props.id, e.currentTarget.value); setIsEdit(!isEdit()) }}></input>
        </Show>
        <Show when={!isEdit()}>
            <div onclick={() => setIsEdit(!isEdit())}>
                <span class="text-sm">
                    {text()}
                </span>
            </div>
        </Show>
    </div>
    )
}
