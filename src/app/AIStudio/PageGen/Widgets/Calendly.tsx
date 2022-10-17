import { createSignal, Show } from "solid-js";
import { updateWidget } from "../../state";

export const Calendly = (props: { data: string, id: string }) => {

    const [isEdit, setIsEdit] = createSignal<boolean>(false);

    const [text, setText] = createSignal<string>(props.data != "" ? props.data : "Calendly link");

    return (<div>
        <Show when={isEdit()}>
            <input placeholder="your calendly link here" value={text()} onblur={(e) => { setText(e.currentTarget.value); updateWidget(props.id, e.currentTarget.value); setIsEdit(!isEdit()) }}></input>
        </Show>
        <Show when={isEdit() == false}>
            <div onclick={() => setIsEdit(!isEdit())}>
                {text()}
            </div>
        </Show>
    </div>
    )
}
