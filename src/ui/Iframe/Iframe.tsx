import { createSignal, Show } from "solid-js"
import { Popup } from "../Popup/Popup"

export const Iframe = (props) => {

    const [clicked, setClicked] = createSignal(false)

    return (
        <div class="flex flex-col">
            <iframe onclick={() => console.log("hiii")} src={props.src} class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
            <div class="shadow-md bg-white rounded-b-[1rem] h-[4rem] flex items-center justify-center cursor-pointer" onClick={() => { setClicked(true)}}>
                <span class="text-[1.0rem] font-semibold">{props.text}</span>
            </div>
            <Show when={clicked() === true}>
                <Popup onCancel={setClicked(false)} submit="true">
                    <iframe class="w-full h-[600px]" src={props.src} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen/>
                </Popup>
            </Show>
        </div>
    )
}