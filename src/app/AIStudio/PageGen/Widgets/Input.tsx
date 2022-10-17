import { createSignal, Match, Show, Switch } from "solid-js";
import { updateWidget } from "../../state";

export const [isDisplay, setIsDisplay] = createSignal<boolean>(false);

export const Input = (props: { data: string, id: string }) => {

    // const [isEdit, setIsEdit] = createSignal<boolean>(false);


    const [text, setText] = createSignal<string>(props.data);

    return (<div>
        <Switch>
            <Match when={isDisplay()}>
                <div class="bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
                    <div class="bg-white px-16 py-14 rounded-md text-center ">
                        <div>
                            <span class="font-[700] p-2">New text input box</span>
                            <div class="flex">
                                <span class="p-2">Question:</span>
                                <input class="bg-gray-200 rounded-md p-2" placeholder="What do you want to ask?" value={text()} onblur={(e) => { setText(e.currentTarget.value); }}></input>
                            </div>
                            <button onclick={() => { setIsDisplay(false); updateWidget(props.id, text()); }} class="rounded-lg items-center bg-[#4EADF1] py-2 px-3 font-[13px] font-semibold text-white font-[Inter] flex items-center gap-2 hover:bg-[#3A9AE0] duration-75">Submit</button>
                        </div>
                    </div>
                </div>
            </Match>
            <Match when={!isDisplay()}>
                <div>
                    <span class="bg-gray-200 rounded-md p-2">{text()}</span>
                </div>
            </Match>
        </Switch>
    </div>
    )
}
