import { Component, createSignal, JSXElement } from "solid-js";
import { For } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";
import { Dynamic } from "solid-js/web";
import { IconContainer } from "../IconContainer";

export const StepMenuProgress = (props: {
    selected?: boolean
}) => {
    return <div class={`w-2 h-2 rounded-full ${props.selected ? "bg-[#4EADF1]" : "bg-[#D9D9D9]"}`} />
}

export const StepMenuSeparator = () => {
    return <div class="border-b border-black/[0.08]"></div>;
}

export type StepMenuAddData = SetStoreFunction<any>;
export type StepMenuProps = { addData: StepMenuAddData, data: any };
export type StepMenuComponent = Component<StepMenuProps>;

export function StepMenu<T extends Array<Record<string, unknown>>>(props: {
    menus: Array<{
        title: string|JSXElement,
        description: string|JSXElement,
        allowSkip?: boolean,
        noSeparator?: boolean,
        body: StepMenuComponent,
        buttonText?: string,
        onNext?: (data: unknown) => Promise<string | void> | string | void
    }>,
    dontCountLast?: boolean,
    allowPrevious?: boolean,
    isNextLoading?: boolean,
    currentStep?: number,
    onFinish?: (data: T) => void,
    onNext?: (currentStep: number) => void
}) {
    const [currentStep, setCurrentStep] = createSignal(props.currentStep || 0);
    const [error, setError] = createSignal<string>();
    const stepsAmount = props.menus.length - (props.dontCountLast ? 1 : 0);
    const [data, setData] = createStore(Array.from({length: stepsAmount}).fill({}));

    return <div class="bg-[#FFFFFF] rounded-[32px] p-8 w-[650px] flex flex-col gap-4 font-[Inter]">
        <div class="flex justify-between font-bold text-[#4EADF1]">
            <p onClick={() => setCurrentStep(currentStep() - 1)} class="cursor-pointer" style={{
                visibility: props.allowPrevious && currentStep() !== 0 ? "visible" : "hidden"
            }}>Back</p>
            <p onClick={() => setCurrentStep(currentStep() + 1)} class="cursor-pointer" style={{
                visibility: props.menus[currentStep()].allowSkip ? "visible" : "hidden"
            }}>Skip</p>
        </div>
        <div class="flex gap-4 flex-col justify-center items-center">
            <div class="flex gap-2 flex-col justify-center items-center max-w-[586px]">
                <p class="text-[33px] leading-10 font-bold">{props.menus[currentStep()].title}</p>
                <p class="text-[17px] leading-6 font-normal text-center text-black/[0.7]">{props.menus[currentStep()].description}</p>
            </div>
            {currentStep() < stepsAmount && <div class="flex gap-2">
                <For each={Array.from({ length: stepsAmount })}>{(_, ind) => {
                    return <StepMenuProgress selected={ind() === currentStep()} />
                }}</For>
            </div>}
        </div>
        {!props.menus[currentStep()].noSeparator && <StepMenuSeparator />}
        <div class="basis-full">
            <Dynamic component={props.menus[currentStep()].body} addData={setData.bind(undefined, currentStep())} data={data[currentStep()]} />
        </div>
        <div class="text-center">
            {error && <p class="pt-2 text-red-800 text-[13px]">{error}</p>}
        </div>
        <div class="flex justify-center items-center">
            <div class="bg-[#4EADF1] p-3 rounded-[12px] cursor-pointer w-[314px] flex justify-center items-center" onClick={async () => {
                if (props.isNextLoading) return;
                const menu = props.menus[currentStep()];
                if (menu.onNext) {
                    const possibleErr = await menu.onNext(data[currentStep()] || {});
                    if (possibleErr) {
                        setError(possibleErr);
                        return;
                    }
                }
                setError(undefined);
                if (currentStep() === (props.menus.length - 1)) return props.onFinish?.(data as T);
                else {
                    setCurrentStep(currentStep() + 1);
                    props.onNext?.(currentStep());
                }
            }}>
                {props.isNextLoading ? <IconContainer><svg class="animate-spin text-white" height="24" width="24" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg></IconContainer> : <p class="text-white font-bold font-size-[15px]">{props.menus[currentStep()].buttonText || "Let's go"}</p>}
            </div>
        </div>
    </div>
}