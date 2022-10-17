import { AppTitle } from "@/ui/AppMenu"
import { ThreePointIconButton } from "@/ui/icons/ThreePointIconButton"
import { ContactInfo } from "@/types"
import { Search } from "../Search"
import { DataTable, defaultStringSortingStartegy, HeaderSortState } from "@/ui/DataTable"
import { TableRow } from "../TableRow"
import { addContacts, getCurrentContacts, getTotalContacts, setCurrentContact, setPage, state } from "../state"
import { useRequest } from "@/helpers/useRequest"
import { getContacts } from "@/api2/addressbook"
import {createSignal, onMount } from "solid-js"
import { Spinner } from "@/ui/icons/Spinner"
import { Scrollable } from "@/ui/Scrollable"
import { BookIcon } from "@/ui/icons/BookIcon"

export const Contacts = () => {
	const [getContactsReq, isLoading1] = useRequest(getContacts);
	let totalContacts = 0;
	const [search, isLoading2] = useRequest(getContacts);
	const [filteredContacts, setFilteredContacts] = createSignal<ContactInfo[]>();

    onMount(async () => {
        if (state.contacts.length) return;
        const contacts = await getContactsReq({ provider: "all", size: 20 });
        if (contacts.code !== 200) return;
		totalContacts = contacts.result.total;
        addContacts(...(contacts.result as { contacts: ContactInfo[] }).contacts)
    });

	return (
		<div>
			<AppTitle
				name={"Contacts"}
				active={false}
				icon={<BookIcon />}
				theme={"black"}
				onClick={console.log}
			>
				<ThreePointIconButton />
			</AppTitle>
			<Search onInput={async (el) => {
				if (!el.value.trim().length) {
					setFilteredContacts();
					return;
				}
				const contacts = await search({ provider: state.currentProvider.toLowerCase(), query: el.value, size: 50 });
				if (contacts.code !== 200 || !el.value.trim().length) setFilteredContacts();
				else setFilteredContacts(contacts.result.contacts);
			}} />
			<div class="flex justify-between items-center pl-8 pr-8 text-[17px]">
				<div class="cursor-pointer text-[22px]" onClick={() => {
                    if (state.page === 0) return;
                    setPage(state.page - 1);
                }}>{"<"}</div>
				<div>{state.page + 1}</div>
				<div class="cursor-pointer text-[22px]" onClick={async () => {
					if (getTotalContacts() >= totalContacts && !state.contacts[state.page + 1]) return;				
					setPage(state.page + 1);
					if (state.contacts[state.page]) return;
					if (filteredContacts() || isLoading1()) return;
					const req = await getContactsReq({ provider: state.currentProvider.toLowerCase(), size: 20, page: state.page });
					if (req.code !== 200) return;
					addContacts(...req.result.contacts);
				}}>{">"}</div>
			</div>
			<Scrollable>
				<div class="h-[calc(100vh_-_140px)]">
					{(console.log(getCurrentContacts(), state), "")}
					<DataTable<ContactInfo>
						disableMultiSelect
						data={((filteredContacts()) ? (filteredContacts() || []) : getCurrentContacts()) as ContactInfo[]}
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
					{(isLoading1() || isLoading2()) && <div class="flex justify-center items-center pt-12">
						<Spinner height="34px" width="34px" />
					</div>}
				</div>
			</Scrollable>
		</div>
	)
}

export default Contacts;