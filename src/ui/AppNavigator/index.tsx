import { Navigator, Outlet, useLocation, useNavigate } from "solid-app-router";
import { Accessor, createSignal, For, JSXElement, ParentProps, Setter, useContext } from "solid-js"
import { createContext } from "solid-js";
import { MenuItem } from "../AppMenu";
import { ContactsIcon } from "../icons/ContactsIcon";

export type AppNavigatorFn = (...paths: string[]) => void;

export const AppNavigatorContext = createContext<{
    navigate: AppNavigatorFn,
    selected: Accessor<string>,
    rawNavigate: Navigator,
    setSelected: Setter<string>,
    location: Array<string>,
    appName: string
}>();

export const App = (props: ParentProps<{name: string}>) => {
    const loc = useLocation();
    const [selected, setSelected] = createSignal((loc.pathname.endsWith("/") ? loc.pathname.slice(0, -1) : loc.pathname).split("/").pop());
    const navigate = useNavigate();

    const subNavigate = (...paths: string[]) => {
        if (!paths.length || paths[0] === "./") {
            navigate("./");
            setSelected(props.name);
        } else {
            navigate(`./${paths.join("/")}`);
            setSelected(paths[paths.length - 1]);
        }
    }

    return <AppNavigatorContext.Provider value={{
        navigate: subNavigate,
        selected,
        setSelected,
        rawNavigate: navigate,
        appName: props.name,
        location: loc.pathname.split("/").slice(1)
    }}>
        <div class="flex w-full">
            {props.children}
            <div class="w-full">
                <Outlet />
            </div>
        </div>
    </AppNavigatorContext.Provider>
}

export const useAppNavigate = () => useContext(AppNavigatorContext).navigate;
export const useAppNavigateSelected = () => useContext(AppNavigatorContext).selected;

export const AppNavigator = (props: {
    routes?: (navigate: AppNavigatorFn, selected: string) => JSXElement,
    simple?: Array<{
        name: string,
        path: string,
        icon?: JSXElement,
        onClick?: () => void
    }>,
    noWelcome?: boolean,
    onLand?: (selected: string) => void
}) => {
    const ctx = useContext(AppNavigatorContext);
    props.onLand?.(ctx.selected());

    return <>
        {!props.noWelcome && <MenuItem
            name="Welcome"
            active={ctx.selected() === ctx.appName}
            icon={<ContactsIcon />}
            onClick={() => {
                ctx.rawNavigate("./");
                ctx.setSelected(ctx.appName);
            }}
        />}
        <For each={props.simple}>{(el) => {
            return <MenuItem
                name={el.name}
                active={ctx.selected() === (el.path || ctx.appName)}
                icon={el.icon || <img src="/icons/contacts.svg" />}
                onClick={() => {
                    el.onClick?.();
                    ctx.rawNavigate(`./${el.path}`);
                    ctx.setSelected(el.path || ctx.appName);
                }}
            />
        }}</For>
        {props.routes?.(ctx.navigate, ctx.selected())}
    </>
}