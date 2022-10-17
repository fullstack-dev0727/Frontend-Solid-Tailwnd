import { MenuItem } from "./MenuItem"


export const MenuItemWelcome = (props: {
    onClick: () => void,
    active?: boolean
}) => {
    return <MenuItem
        name="Welcome"
        active={props.active}
        icon={<img src="icons/contacts.svg" />}
        onClickPlus={() => { }}
        onClickSettings={() => { }}
        onClick={props.onClick}
    />
}