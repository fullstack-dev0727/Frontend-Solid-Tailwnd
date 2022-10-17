import { useSearchParams } from "solid-app-router";
import { Component, createSignal, Switch, Match } from "solid-js"
import { verifyAuth } from "./api2/auth";
import { RouteInfo } from "./types"
import { Spinner } from "./ui/icons/Spinner";

export const enum VerifyState {
    Waiting,
    NotVerified,
    Verified
}

export const VerifyAuth: Component = () => {
    const [verified, setVerified] = createSignal<VerifyState>(VerifyState.Waiting);
    const [params] = useSearchParams<{token?: string, code?: string}>();
    if (params.token) {
        
        verifyAuth({token: params.token || params.code, user_id: localStorage.getItem("user_id")}).then(result => {
            console.log(result)
            if (result.code !== 200) setVerified(VerifyState.NotVerified);
            else {
                localStorage.setItem("oauth_token", result.result.id_token);
                setVerified(VerifyState.Verified);
                window.close();
            }
        });
    }
    else if (params.code) {
        localStorage.setItem("oauth_token", params.code);
        setVerified(VerifyState.Verified);
        window.close();
    } else {
        setVerified(VerifyState.NotVerified);
    }
    return <div class="w-full h-100 flex justify-center items-center">
        <Switch>
            <Match when={verified() === VerifyState.Waiting}>
                <Spinner height="48px" width="48px" />
            </Match>
            <Match when={verified() === VerifyState.NotVerified}>
                <h1>Verification failed.</h1>
            </Match>
            <Match when={verified() === VerifyState.Verified}>
                <h1>Verified! You can now close this window.</h1>
            </Match>
        </Switch>
    </div>
}


export const VerifyAuthRoute: RouteInfo = {
	path: "/verify",
    notApp: true,
	component: VerifyAuth
}
