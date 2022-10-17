import { DataTableHeaderResizeInfo } from "@/ui/DataTable"
import { DataRowWrapper, StyledRowField } from "@/ui/DataTable/dataRow"
import { Component, For } from "solid-js"
import { ContactInfo } from "@/types"
import { ContextBox } from "@/ui/ContextMenu/ContextBox"
import { state, addContactToTag as addContactToTagState, removeContactFromTag as removeContactFromTagState } from "./state"
import { tagGroup } from "@/api2/addressbook"
import { GmailIcon } from "@/ui/icons/GmailIcon"
import { OutlookIcon } from "@/ui/icons/OutlookIcon"
import { Dynamic } from "solid-js/web"
import { HubspotIcon } from "@/ui/icons/HubspotIcon"

const ProviderIcons: Record<string, Component> = {
	"google": () => <GmailIcon size="16px" />,
	"outlook": () => <OutlookIcon size="16px" />,
	"hubspot": () => <HubspotIcon size="16px" />
}

export const TagSelect = (props: {
	contact: ContactInfo
}) => {
	return <div class="flex gap-2 flex-col bg-white p-4 rounded">
		<For each={state.tags}>{(tag) => {
			return <div class="flex items-center gap-4" onClick={() => {
				if (tag.contacts?.some(c => c.identifier === props.contact.identifier)) {
					removeContactFromTagState(tag.id, props.contact.identifier);
					tagGroup.delete({
						identifier: props.contact.identifier,
						tag_id: tag.id
					});
				} else {
					addContactToTagState(tag.id, props.contact);
					tagGroup.create({
						identifier: props.contact.identifier,
						tag_id: tag.id
					});
				}
			}}>
				<div class={`w-[16px] h-[16px] rounded-full ${tag.contacts?.some(c => c.identifier === props.contact.identifier) ? "bg-blue-600" : "bg-gray-300"}`} />
				<p class="text-[15px]">{tag.name}</p>
			</div>
		}}</For>
		{state.tags.length === 0 && <div>
			<p class="text-[15px]">Create a tag first!</p>	
		</div>}
	</div>
}

export const TableRow: Component<{
	contact: ContactInfo,
	resize: DataTableHeaderResizeInfo
}> = (props) => {
	return <ContextBox items={[
		{
			name: "Manage tags",
			sub: {
				element: () => <TagSelect contact={props.contact} />
			}
		},
		...(state.currentTag ? [{
			name: "Remove from tag",
			onClick: () => {
				removeContactFromTagState(state.currentTag, props.contact.identifier);
				tagGroup.delete({
					tag_id: state.currentTag,
					identifier: props.contact.identifier
				});
			}
		}] : [])
	]}>{(setContextMenu) => {
		return <div onContextMenu={(e) => {
			e.preventDefault();
			setContextMenu(true, e);
		}}>
			<DataRowWrapper>
				<StyledRowField resize={props.resize[0]}>
					<div class="flex gap-2 items-center">
						<Dynamic component={ProviderIcons[props.contact.provider]} />
						{props.contact.name}
					</div>
				</StyledRowField>
				<StyledRowField resize={props.resize[1]}>
					{props.contact.email_addresses[0] || "-"}
				</StyledRowField>
				<StyledRowField resize={props.resize[2]}>
					{props.contact.phone_numbers[0] || "-"}
				</StyledRowField>
			</DataRowWrapper>
		</div>
	}}</ContextBox>
}
