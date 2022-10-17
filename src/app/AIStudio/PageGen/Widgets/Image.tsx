import { createEffect, createSignal, Match, Switch } from "solid-js";
import { updateWidget } from "../../state";

export const Image = (props: { id: string,data: string }) => {

    const [isEdit, setIsEdit] = createSignal<boolean>(true);

    const [image, setImage] = createSignal<string>(props.data != "" ? props.data : "");

    return (<Switch>
        <Match when={isEdit()}>
            <input type="file" onchange={(e) => {
                const file = e.currentTarget.files[0];
                console.log(file);
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    updateWidget(props.id, image());
                    setIsEdit(false);
                    setImage(reader.result as string);
                }
            }}></input>
        </Match>

        <Match when={!isEdit()}>
            <img class="h-[100px] w-[100px] items-center" src={image()}></img>
        </Match>

    </Switch>
    )
}
