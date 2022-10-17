
import { MenuItem } from "@/ui/AppMenu"
import { AppNavigatorFn } from "@/ui/AppNavigator"
import { ContextBox } from "@/ui/ContextMenu/ContextBox"
import { EditMenu } from "@/ui/ContextMenu/EditMenu"
import SettingsIconButton from "@/ui/IconButtons/settings"
import { TagIcon } from "@/ui/icons"
import { removeTag, renameTag, setCurrentTag, state } from "../state"
import { TagInfo } from "../types"
import { deleteTag, tags } from "@/api2/addressbook"

export const TagMenu = (props: {
    tag: TagInfo,
    selected?: boolean,
    navigate: AppNavigatorFn
}) => {
    return <ContextBox items={[
        {
            name: "Rename",
            sub: {
                element: (hide) => <EditMenu placeholder="New name" value={props.tag.name} onChange={(text) => renameTag(props.tag.id, text)} onHide={hide} />,
                onHide: () => tags.update({id: props.tag.id, name: props.tag.name })
            }
        },
        {
            name: "Delete",
            onClick: () => {
                deleteTag(props.tag.id);
                removeTag(props.tag.id);
                if (state.currentTag === props.tag.id) {
                    setCurrentTag();
                    props.navigate("./");
                }
            }
        }
    ]}>{(setContextMenu, isActive) => <MenuItem
        name={props.tag.name}
        icon={() => <TagIcon size={() => 16} />}
        active={props.selected}
        onClick={() => {
            setCurrentTag(props.tag.id);
            props.navigate("tag", props.tag.id);
        }}
    >
        <SettingsIconButton onClick={() => {
            setContextMenu(!isActive);
        }} />
    </MenuItem>
        }</ContextBox>
}