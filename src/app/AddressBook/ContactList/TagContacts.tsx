import { ContactInfo, tagGroup } from "@/api2/addressbook";
import { useRequest } from "@/helpers/useRequest";
import { AppTitle } from "@/ui/AppMenu";
import { DataTable, defaultStringSortingStartegy, HeaderSortState } from "@/ui/DataTable";
import { BookIcon } from "@/ui/icons/BookIcon";
import { Spinner } from "@/ui/icons/Spinner";
import { ThreePointIconButton } from "@/ui/icons/ThreePointIconButton";
import { Scrollable } from "@/ui/Scrollable";
import { createEffect, on } from "solid-js";
import { getCurrentContacts, getCurrentTag, setCurrentContact, setTagContacts, state } from "../state";
import { TableRow } from "../TableRow";

let isMounted = false;

export const TagContacts = () => { 
    const [getTagContactsReq, isLoading] = useRequest(tagGroup.read);

    createEffect(on([() => state.currentTag], async (_, prev) => {
		if (!getCurrentTag()) return;
        if (isMounted && prev === undefined) return;
		isMounted = true;
        const tag = getCurrentTag();
        if (tag && tag.contacts) return;
        const res = await getTagContactsReq({id: state.currentTag});
        if (res.code !== 200) return;
        setTagContacts(state.currentTag, res.result.contacts);
    }));

    return <div>
			<AppTitle
				name={"Contacts"}
				active={false}
				icon={<BookIcon />}
				theme={"black"}
				onClick={console.log}
			>
				<ThreePointIconButton />
			</AppTitle>
			<Scrollable>
				<div class="h-[calc(100vh_-_88px)]">
					<DataTable<ContactInfo>
						disableMultiSelect
						data={getCurrentContacts() as ContactInfo[]}
						headers={[
							{
								name: "Name",
								sort: defaultStringSortingStartegy("name")
							},
							{
								name: "Email",
								sort: (sortState: HeaderSortState, things: ContactInfo[]) => {
									if (sortState === HeaderSortState.SortingAscending) return things.slice().sort((a, b) => (b.email_addresses[0] as unknown as string)?.localeCompare(a.email_addresses[0] as unknown as string));
									else return things.slice().sort((a, b) => (a.email_addresses[0] as unknown as string)?.localeCompare(b.email_addresses[0] as unknown as string));
								}
							},
							{
								name: "Phone",
								sort: (sortState: HeaderSortState, things: ContactInfo[]) => {
									if (sortState === HeaderSortState.SortingAscending) return things.slice().sort((a, b) => (b.phone_numbers[0] as unknown as string)?.localeCompare(a.phone_numbers[0] as unknown as string));
									else return things.slice().sort((a, b) => (a.phone_numbers[0] as unknown as string)?.localeCompare(b.phone_numbers[0] as unknown as string));
								},
								noResize: true
							}
						]}
						resolveData={(item, resize) => <TableRow contact={item} resize={resize} />}
						onSelect={([contact]) => contact && setCurrentContact(contact)}
					/>
					{isLoading() && <div class="flex justify-center items-center pt-12">
						<Spinner height="34px" width="34px" />
					</div>}
				</div>
			</Scrollable>
    </div>
}

export default TagContacts;