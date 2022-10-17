import { Page } from "@/app/AIStudio/PageGen/Page";

export const AppWelcome = (props: {
    welcomeVideo: string
}) => {
    return <div>
        This is a welcome page for the app...
        Link to video: {props.welcomeVideo}
    </div>
}

export default AppWelcome;