import { generated_page } from "@/api2/ai_studio";
import { del } from "@/api2/ops";
import { DeleteIcon } from "@/assets/icons";
import {
  DragDropProvider,
  DragDropSensors,
  DragEventHandler,
  createDroppable,
} from "@thisbeyond/solid-dnd";
import { createSignal, For, onMount, Show } from "solid-js";
import { addPages, addWidget, currentPage, currentWidgets, getCurrentVideo, removeWidget, state } from "../state";
import { Settings } from "./Settings";
import { Widgets, widgetsList } from "./Widgets";
import { setIsDisplay } from "./Widgets/Input";

const Droppable = () => {
  const droppable = createDroppable(1);
  return (
    <div
      use:droppable
      style={{ height: '400px' }}
      class="flex flex-col items-center text-center droppable border-dashed border-2 border-gray-600 w-full p-10 space-y-4"
      classList={{ "!droppable-accept": droppable.isActiveDroppable }}
    >
      <Show when={currentWidgets().length == 0}>
        Drag & drop your widgets here
      </Show>
      <div class="flex flex-col scrollbar-hide overflow-auto">
        <For each={currentWidgets()}>
          {(item, _) => {
            const name = item.index.split('-')[0];
            const index = widgetsList.findIndex(w => w.name == name);
            return (<div class="flex justify-evenly items-center">
              <div class="p-2">
                {widgetsList[index].component({
                  id: item.index,
                  emojiEnabled: true,
                  data: item.data,
                  commentsEnabled: true
                })}
              </div>
              <div>
                <button onclick={async () => {
                  if (item.id) {
                    await del(`/api/widget?id=${item.id}`,'https://page.dev.bhuman.ai');
                  }
                  removeWidget(item.index)
                }}>
                  <DeleteIcon />
                </button>
                {/* <button class="rounded-lg items-center bg-[#4EADF1] py-2 px-3 font-[13px] font-semibold text-white font-[Inter] flex items-center gap-2 hover:bg-[#3A9AE0] duration-75">Delete</button> */}
              </div>
            </div>
            )
          }}
        </For>
      </div>
    </div >
  );
};

export const Page = () => {

  const [tabId, setTabId] = createSignal<"builder" | "settings">("builder");

  let ref: HTMLElement;

  const onDragEnd: DragEventHandler = (({ draggable, droppable }) => {
    if (droppable) {
      let node = draggable.node;
      let split = node.id.split('-');
      let nodeId = parseInt(split[1]);
      if (split[0] == "input") {
        setIsDisplay(true);
      }
      // console.log(,nodeId);
      addWidget({ index: `${split[0]}-${nodeId + currentWidgets().length}`, name: split[0], data: "", id: null });
      // droppable.node.append(draggable.node);
    }
  });

  return (<>
    <div class="flex pb-4">
      <div class="pr-4">
        <div class="font-[700] cursor-pointer"
          classList={{ "underline underline-offset-2": tabId() === "builder" }}
          onClick={() => setTabId("builder")}>Page Builder</div>
      </div>
      <div>
        <div class="font-[700] cursor-pointer" classList={{ "underline underline-offset-2": tabId() === "settings" }}
          onClick={() => setTabId("settings")}>Settings</div>
      </div>
    </div>
    <Show when={tabId() == "builder"}>
      <DragDropProvider onDragEnd={onDragEnd}>
        <DragDropSensors>
          <div class="flex flex-cols-auto items-center">
            <Widgets ref={ref} />
          </div>
          <hr class="p-2"></hr>
          <Droppable />
        </DragDropSensors>
      </DragDropProvider>
    </Show>

    <Show when={tabId() == "settings"}>
      <Settings />
    </Show>

  </>)
}
