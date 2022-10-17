import { JSXElement } from "solid-js";
import { setTutorialComplete } from "./TooltipTutorials";

export type tutorials = {
    currentTutorial: tutorial,
    tutorials: tutorial[]
}

export type tutorial = {
    menuItem: string
    body: JSXElement
    title: string
    videoUrl: string
    submit?: () => void
}

export const aiStudioTutorial: tutorial =
{
    menuItem: "Intro",
    body: <>All your video templates are organized inside folders. Double click the video template to begin.</>,
    title: "Welcome to AIStudio",
    videoUrl: "https://assets-bhuman-new.s3.amazonaws.com/onboarding/1.mp4",
}

export const nextStep = (): void => {
}


export const editorTutorial: tutorial[] = [
    {
        menuItem: "Intro",
        body: <>In the first tab you have a Database that stores your data. Assets where your files are kept. On the right you have Recording tools, and below you&apos;ll find your timeline with pauses and variables.</>,
        title: "Some basics...",
        videoUrl: "https://assets-bhuman-new.s3.amazonaws.com/onboarding/2.mp4",
        submit: () => nextStep()
    },
    {
        menuItem: "Rules",
        body:
            <div class="flex flex-col gap-[4px]">
                <p>↕ Distance - 4+ feet from the camera. The further, the better.</p>
                <p>💡Lighting - Soft and even across your face</p>
            </div>,
        title: "Some simple rules...",
        videoUrl: "https://assets-bhuman-new.s3.amazonaws.com/onboarding/3.mp4",
        submit: () => nextStep()
    },
    {
        menuItem: "Template",
        body:
            <div class="flex flex-col gap-[12px]">
                Click Record and read the script below. Make a slight pause after “Name”. Hit the red button to stop recording, and click Save.
                <div class="flex items-center bg-[#F9EAB5] w-[476px] h-[76px] p-[16px] italic text-[#974111] font-[500] text-[15px] leading-[22.5px] rounded-[8px]">
                    Hello Name *Pause*, this is my first AI video. Isn&apos;t it cool? I&apos;m excited to make more videos after this
                </div>
            </div>,
        title: "Let's record your first video",
        videoUrl: "https://assets-bhuman-new.s3.amazonaws.com/onboarding/4.mp4",
        submit: () => nextStep()
    },
    {
        menuItem: "Variables",
        body: "Just highlight the text you want to personalize, give it a label and click create. We auto-create a matching header in the spreadsheet",
        title: "Let's create a variable",
        videoUrl: "https://assets-bhuman-new.s3.amazonaws.com/onboarding/5.mp4",
        submit: () => nextStep()
    },
    {
        menuItem: "Data",
        body:
            <div class="flex flex-col gap-[4px]">
                You can import a spreadsheet under Assets or enter manually. Enter “Bob”, “Lisa” under the Name column.
            </div>
        ,
        title: "Let's add Data",
        videoUrl: "https://assets-bhuman-new.s3.amazonaws.com/onboarding/6.mp4",
        submit: () => nextStep()
    },
    {
        menuItem: "Audio",
        body:
            <div class="flex flex-col gap-[4px]">
                <div>
                    🏖 Auto - Click Generate Audio button and done!
                </div>
                <div>
                    🎤 Manual - Click the microphone icon and say “Hi Bob”. Click the red dot to stop recording. Repeat the same for Lisa.
                </div>
            </div>
        ,
        title: "Variable Audio - 2 ways to add",
        videoUrl: "https://assets-bhuman-new.s3.amazonaws.com/onboarding/7.mp4",
        submit: () => setTutorialComplete(true)
    }
]