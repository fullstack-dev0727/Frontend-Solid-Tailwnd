import { createSignal, Show } from "solid-js";
import { updateWidget } from "../../state";

export const Title = (props: { data: string,id: string }) => {

    const [isEdit, setIsEdit] = createSignal<boolean>(false);

    const [text, setText] = createSignal<string>(props.data != "" ? props.data : "Title");

    return (<div>
        <Show when={isEdit()}>
            <input placeholder="your text here" value={text()} onblur={(e) => { setText(e.currentTarget.value); updateWidget(props.id, e.currentTarget.value); setIsEdit(!isEdit()) }}></input>
        </Show>
        <Show when={!isEdit()}>
            <div onclick={() => setIsEdit(!isEdit())}>
                <span class="font-[700] text-lg">
                    {text()}
                </span>
            </div>
        </Show>
    </div>
    )
}
