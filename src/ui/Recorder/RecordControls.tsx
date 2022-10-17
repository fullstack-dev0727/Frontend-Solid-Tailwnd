import { transcriptionProgress } from "@/app/AIStudio/Editor/state"
import { ParentProps, Component, createSignal, Switch, Match, Show } from "solid-js"
import { WandIcon } from "../icons"
import { Spinner } from "../icons/Spinner"
import { ProgressBar } from "../ProgressBar"
import { RecorderState } from "./Recorder"

export const TimeContainer = (props: ParentProps<{ recorderState: string }>) => {
    return (
        <div class={`flex justify-center items-center z-[99] text-white w-[102px] h-[32px]  text-center text-[17px] font-[500] rounded-[8px] mt-[34px] ${props.recorderState === "recording" ? "bg-[#FF0000]" : "bg-[#000000A3]"}`}>
            {props.children}
        </div>
    )
}

export const StartRecordingButton: Component<{ onClick: () => void }> = (
    props
) => {
    return (
        <div
            class="rounded-full border-white border-[8px] w-[96px] h-[96px] flex items-center justify-center group"
            {...props}
        >
            <div class="rounded-full w-[84px] h-[84px] bg-[#FF0000] group-hover:bg-red-700 duration-75"></div>
        </div>
    )
}

export const StopRecordingButton: Component<{ onClick: () => void }> = (
    props
) => {
    return (
        <div
            class="rounded-full border-white border-[8px] w-[96px] h-[96px] flex items-center justify-center group"
            {...props}
        >
            <div class="rounded-md w-[48px] h-[48px] bg-[#FF0000] group-hover:bg-red-700 duration-75"></div>
        </div>
    )
}

export const SaveRecordingButton: Component<{ onPlay: () => void, onPause: () => void, onSave: () => void, onCancel: () => void, saveText: string }> = (
    props
) => {
    const [isPlaying, setIsPlaying] = createSignal(false)

    return (
        <div class="flex justify-between items-center w-full">
            <div class="w-[44px] h-[44px] cursor-pointer" >
                <Switch>
                    <Match when={!isPlaying()}>
                        <PlayButton onClick={() => { props.onPlay(); setIsPlaying(!isPlaying()) }} />
                    </Match>
                    <Match when={isPlaying()}>
                        <PauseButton onClick={() => { props.onPause(); setIsPlaying(!isPlaying()) }} />
                    </Match>
                </Switch>
            </div>
            <div class="bg-[#FFFFFF] rounded-[24px]  px-[32px] py-[12px] flex items-center justify-center font-[500] cursor-pointer" onClick={props.onSave}>
                <Show when={props.saveText === "Uploading"}>
                    <ProgressBar.FlatProgressBar
                        completed={(transcriptionProgress().step / transcriptionProgress().total) * 100}
                        borderRadius="10px"
                        bgColor="#4EADF1"
                        height="6px"
                        width="340px"
                        isLabelVisible={false}
                        labelColor="#e80909"
                    />
                </Show>
                <Show when={props.saveText === "Save"}>
                    Save
                </Show>
            </div>
            <div class="w-[44px] h-[44px] cursor-pointer" onClick={props.onCancel}>
                <svg width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.6999 5.7998H21.2999C21.2999 4.92459 20.9522 4.08522 20.3334 3.46635C19.7145 2.84748 18.8751 2.4998 17.9999 2.4998C17.1247 2.4998 16.2853 2.84748 15.6664 3.46635C15.0476 4.08522 14.6999 4.92459 14.6999 5.7998ZM12.4999 5.7998C12.4999 4.34111 13.0794 2.94217 14.1108 1.91072C15.1423 0.879267 16.5412 0.299805 17.9999 0.299805C19.4586 0.299805 20.8575 0.879267 21.889 1.91072C22.9204 2.94217 23.4999 4.34111 23.4999 5.7998H34.4999C34.7916 5.7998 35.0714 5.9157 35.2777 6.12199C35.484 6.32828 35.5999 6.60807 35.5999 6.89981C35.5999 7.19154 35.484 7.47133 35.2777 7.67762C35.0714 7.88391 34.7916 7.9998 34.4999 7.9998H32.1811L29.5543 30.7566C29.3686 32.3652 28.598 33.8494 27.3892 34.9269C26.1804 36.0043 24.6176 36.5997 22.9983 36.5998H13.0015C11.3822 36.5997 9.81945 36.0043 8.6106 34.9269C7.40176 33.8494 6.63118 32.3652 6.4455 30.7566L3.8187 7.9998H1.4999C1.20816 7.9998 0.928375 7.88391 0.722085 7.67762C0.515795 7.47133 0.399902 7.19154 0.399902 6.89981C0.399902 6.60807 0.515795 6.32828 0.722085 6.12199C0.928375 5.9157 1.20816 5.7998 1.4999 5.7998H12.4999ZM15.7999 14.5998C15.7999 14.3081 15.684 14.0283 15.4777 13.822C15.2714 13.6157 14.9916 13.4998 14.6999 13.4998C14.4082 13.4998 14.1284 13.6157 13.9221 13.822C13.7158 14.0283 13.5999 14.3081 13.5999 14.5998V27.7998C13.5999 28.0915 13.7158 28.3713 13.9221 28.5776C14.1284 28.7839 14.4082 28.8998 14.6999 28.8998C14.9916 28.8998 15.2714 28.7839 15.4777 28.5776C15.684 28.3713 15.7999 28.0915 15.7999 27.7998V14.5998ZM21.2999 13.4998C21.0082 13.4998 20.7284 13.6157 20.5221 13.822C20.3158 14.0283 20.1999 14.3081 20.1999 14.5998V27.7998C20.1999 28.0915 20.3158 28.3713 20.5221 28.5776C20.7284 28.7839 21.0082 28.8998 21.2999 28.8998C21.5916 28.8998 21.8714 28.7839 22.0777 28.5776C22.284 28.3713 22.3999 28.0915 22.3999 27.7998V14.5998C22.3999 14.3081 22.284 14.0283 22.0777 13.822C21.8714 13.6157 21.5916 13.4998 21.2999 13.4998Z" fill="white" />
                </svg>
            </div>
        </div>
    )
}


export const PlayButton: Component<{ onClick: () => void }> = (
    props
) => {
    return (
        <div {...props}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 22C44 27.8348 41.6822 33.4305 37.5564 37.5564C33.4305 41.6822 27.8348 44 22 44C16.1652 44 10.5695 41.6822 6.44365 37.5564C2.31785 33.4305 0 27.8348 0 22C0 16.1652 2.31785 10.5695 6.44365 6.44365C10.5695 2.31785 16.1652 0 22 0C27.8348 0 33.4305 2.31785 37.5564 6.44365C41.6822 10.5695 44 16.1652 44 22ZM18.6725 14.0057C18.4669 13.8594 18.225 13.7724 17.9732 13.7544C17.7215 13.7363 17.4696 13.7879 17.2453 13.9035C17.0209 14.0191 16.8327 14.1942 16.7012 14.4097C16.5698 14.6251 16.5002 14.8726 16.5 15.125V28.875C16.5002 29.1274 16.5698 29.3749 16.7012 29.5903C16.8327 29.8058 17.0209 29.9809 17.2453 30.0965C17.4696 30.2121 17.7215 30.2637 17.9732 30.2456C18.225 30.2276 18.4669 30.1406 18.6725 29.9942L28.2975 23.1192C28.4757 22.9921 28.621 22.8241 28.7213 22.6295C28.8215 22.4348 28.8738 22.219 28.8738 22C28.8738 21.781 28.8215 21.5652 28.7213 21.3705C28.621 21.1759 28.4757 21.0079 28.2975 20.8808L18.6725 14.0057Z" fill="white" />
            </svg>
        </div>
    )
}

export const PauseButton: Component<{ onClick: () => void }> = (
    props
) => {
    return (
        <div {...props}>
            <svg height="44px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="44px" xmlns="http://www.w3.org/2000/svg" ><g>
                <path d="M224,435.8V76.1c0-6.7-5.4-12.1-12.2-12.1h-71.6c-6.8,0-12.2,5.4-12.2,12.1v359.7c0,6.7,5.4,12.2,12.2,12.2h71.6   C218.6,448,224,442.6,224,435.8z" fill="#ffffff" class="fill-000000" />
                <path d="M371.8,64h-71.6c-6.7,0-12.2,5.4-12.2,12.1v359.7c0,6.7,5.4,12.2,12.2,12.2h71.6c6.7,0,12.2-5.4,12.2-12.2V76.1   C384,69.4,378.6,64,371.8,64z" fill="#ffffff" class="fill-000000" /></g>
            </svg>
        </div>
    )
}


export const RecorderBar: Component<{
    onPlay: () => void
    onPause: () => void
    onCancel: () => void
    onSave: () => void
    onRecord: () => void
    onPlayerPause: () => void
    disabled: boolean
    saveText: string
    saveLoading: boolean
    currentTime: string
    recorderState: RecorderState
}> = (props) => {
    return (
        <div class="p-3">
            <div class="flex justify-center items-center px-5">
                <Switch>
                    <Match when={props.recorderState === "idle"}>
                        <StartRecordingButton onClick={props.onRecord} />
                    </Match>
                    <Match when={props.recorderState === "recording"}>
                        <StopRecordingButton onClick={props.onPause} />
                    </Match>
                    <Match when={props.recorderState === "canPlay" || "playing" || "paused"}>
                        <SaveRecordingButton onPlay={props.onPlay} onSave={props.onSave} onCancel={props.onCancel} onPause={props.onPlayerPause} saveText={props.saveText} />
                    </Match>
                </Switch>
                {/* <div class="flex rounded-lg overflow-hidden gap-[2px]">
                    <button
                        class="bg-[#4EADF1] py-2 px-3 font-[13px] font-semibold text-white font-[Inter] flex items-center gap-2 hover:bg-[#3A9AE0] duration-75"
                        onClick={props.onSave}
                        disabled={props.disabled || props.saveLoading}
                        classList={{
                            "opacity-50 cursor-not-allowed": props.disabled,
                        }}
                    >
                        <Show
                            when={props.saveLoading}
                            fallback={<WandIcon size={12} />}
                        >
                            <Spinner height="h-6 mr-[-5px]" />
                        </Show>
                        {props.saveText}
                        <Show when={props.saveText === "Transcribing"}>
                            {" "}
                            {transcriptionProgress().step}/{transcriptionProgress().total}
                        </Show>
                    </button>
                </div> */}
            </div>
        </div>
    )
}