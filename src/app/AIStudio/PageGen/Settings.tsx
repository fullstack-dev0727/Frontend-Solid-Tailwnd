import { generated_page } from "@/api2/ai_studio";
import { createEffect, createSignal } from "solid-js";
import { currentPage, currentSettings, updateSettings } from "../state";

export const Settings = () => {

    const [isVimeo, setIsVimeo] = createSignal<boolean>(currentSettings().vimeo_enabled);
    const [isEmoji, setIsEmoji] = createSignal<boolean>(currentSettings().emoji_enabled);
    const [isComments, setIsComments] = createSignal<boolean>(currentSettings().comments_enabled);
    const [isDefault, setIsDefault] = createSignal<boolean>(currentSettings().default_template);

    console.log("VIMEO:", currentSettings().vimeo_enabled);

    createEffect(() => {
        let page = currentPage();
        generated_page.create({
            page: {
                comments_enabled: isComments(),
                emoji_enabled: isEmoji(),
                vimeo_enabled: isVimeo(),
                default_template: isDefault(),
                name: "Default",
                video: page.video,
                video_instance: page.video_instance,
            },
            widgets: page.widgets
        })
    })

    return (<div class="flex flex-col">
        <div>
            <div class="font-[700] p-2">
                Vimeo
            </div>
            <div class="flex justify-between p-1">
                <span class="">Upload my videos to Vimeo,don't use Page Builder</span>
                <label for="vimeo" class="flex items-center cursor-pointer relative mb-4">
                    <input type="checkbox" id="vimeo" class="sr-only" checked={isVimeo()} onclick={() => {
                        setIsVimeo(!isVimeo());
                        updateSettings({ vimeo_enabled: isVimeo() })

                    }} />
                    <div class="toggle-bg bg-white border-2 border-black h-6 w-11 rounded-full"></div>
                </label>
            </div>
        </div>
        <div>
        </div>

        <div>
            <div class="font-[700] p-2">
                Emojis
            </div>
            <div class="flex justify-between p-1">
                <span>Toggle to enable emoji reactions to your video</span>
                <label for="emoji" class="flex items-center cursor-pointer relative mb-4">
                    <input type="checkbox" id="emoji" class="sr-only" checked={isEmoji()} onclick={() => {
                        setIsEmoji(!isEmoji());
                        updateSettings({ emoji_enabled: isEmoji() })
                    }} />
                    <div class="toggle-bg bg-white border-2 border-black h-6 w-11 rounded-full"></div>
                </label>
            </div>
        </div>
        <div>
            <div class="font-[700] p-2">
                Comments
            </div>
            <div class="flex justify-between p-1">
                <span>Toggle to enable comments on your page</span>
                <label for="comments" class="flex items-center cursor-pointer relative mb-4">
                    <input type="checkbox" id="comments" class="sr-only" checked={isComments()} onclick={() => { setIsComments(!isComments()); updateSettings({ comments_enabled: isComments() }) }} />
                    <div class="toggle-bg bg-white border-2 border-black h-6 w-11 rounded-full"></div>
                </label>
            </div>
        </div>
        <div>
            <div class="font-[700] p-2">
                Default
            </div>
            <div class="flex justify-between p-1">
                <span>Make this page my default for all video templates</span>
                <label for="default" class="flex items-center cursor-pointer relative mb-4">
                    <input type="checkbox" id="default" class="sr-only" checked={isDefault()} onclick={() => { setIsDefault(!isDefault()); updateSettings({ default_template: isDefault() }) }} />
                    <div class="toggle-bg bg-white border-2 border-black h-6 w-11 rounded-full"></div>
                </label>
            </div>
        </div>
        {/* <div>
            <div class="font-[700] p-2">
                Copy From Template
            </div>
            <div class="flex flex-col">
                <span class="p-2">Select a template to copy the page from</span>
                <select class="w-min" value="Template 1">
                    <option>Template 1</option>
                </select>
            </div>
        </div> */}
    </div>)
};