import { useNavigate } from "solid-app-router"
import { Switch, Match } from "solid-js"
import { Avatar } from "./TooltipTutorials"

export const WelcomeTutorial = (props: {
    name?: string,
    likes?: string,
    content?: string
    title?: string
    isWelcome?: boolean
    onClick?: () => void
}) => {
    const navigate = useNavigate()
    return (
        <div class="flex flex-col w-[508px] h-[388px] p-[48px] text-[#1D1D1F] bg-[#FFFFFF] rounded-[24px] shadow-[0px_4px_24px_rgba(0,0,0,0.16)] gap-[24px]" >
            <div class="flex flex-col gap-[12px]">
                <Switch>
                    <Match when={!props.isWelcome}>
                        <img src="/party.svg" alt="welcome" class="w-[96px] h-[96px]" />
                        <div class="flex flex-col gap-[4px]">
                            <div class="font-[600] text-[21px] leading-[28px]">Hit Generate!</div>
                            <div class="text-[15px] leading-[150%]">Click the magic button — Generate. We’ll notify you once the videos are generated.</div>
                        </div>
                    </Match>
                    <Match when={props.isWelcome}>
                        <img src="/don.png" class="w-[96px] h-[96px] rounded-[50%] object-cover" />
                        <div class="flex flex-col gap-[4px]">
                            <div class="font-[600] text-[21px] leading-[28px]">Welcome to AI Editor</div>
                            <div class="text-[15px] leading-[150%]">{props.name}, I’ve created a tutorial for you so you can generate AI videos with ease. Become a pro in less than 3 minutes.</div>
                        </div>
                    </Match>
                </Switch>
            </div>
            <div class="flex flex-row items-center text-[13px] leading-[19px] font-[500] gap-[4px] h-[24px]">
                <Avatar />
                <div>
                    +{props.likes} loved it
                </div>
            </div>
            <div class="flex items-center justify-center w-[118px] h-[36px] rounded-[24px] bg-[#187FE7] cursor-pointer text-[15px] font-[500] text-white" onClick={() => {
                // navigate("../ai-studio")
                // state.firstTimeUser = false
                props.onClick()
            }
            }>
                {props.isWelcome ? "Show me" : "View again"}
            </div>

        </div>
    )
}