import { ContactInfo } from "@/types";
import { createStore } from "solid-js/store"
import { AddressBookState, TagInfo } from "./types"

export const [state, setState] = createStore<AddressBookState>({
	currentTag: "",
	contacts: [],
	tags: [],
	page: 0,
	providers: [],
});

export function getCurrentProviders() {
	return state.providers;
}

export function setProviders(providers: string[]) {
	setState({ providers });
}

export function setCurrentProvider(provider: string) {
	setState("currentProvider", provider);
}

export function getCurrentContacts() {
	return (state.currentTag ? (state.tags.find(t => t.id === state.currentTag)?.contacts) : state.contacts[state.page]) || [];
}

export function setCurrentContacts(contact: ContactInfo[]) {
	setState("contacts", state.page, contact);
}


export function setCurrentTag(tag?: string) {
	setState("currentTag", tag);
}

export function getCurrentTag() {
	return state.tags.find(t => t.id === state.currentTag);
}

export function addContacts(...contacts: ContactInfo[]) {
	setState("contacts", state.page, (c) => [...(c || []), ...contacts]);
}

export function getTotalContacts() {
	return state.contacts.reduce((a, c) => a + c.length, 0);
}

export function addTags(...tags: TagInfo[]) {
	setState("tags", (t) => [...t, ...tags]);
}

export function setCurrentContact(contact: ContactInfo) {
	setState("currentContact", contact.identifier);
}

export function getCurrentContact() {
	return state.contacts[state.page]?.find(c => c.identifier === state.currentContact) || getCurrentTag()?.contacts?.find(c => c.identifier === state.currentContact);
}

export function renameTag(id: string, name: string) {
	setState("tags",
		t => t.id === id,
		"name",
		name
	);
}

export function removeTag(id: string) {
	setState("tags", (t) => t.filter(t => t.id !== id));
}

export function setTagContacts(id: string, contacts: ContactInfo[]) {
	setState("tags", (t) => t.id === id, "contacts", contacts);
}

export function addContactToTag(id: string, contact: ContactInfo) {
	setState("tags", (t) => t.id === id, "contacts", (c) => c ? [...c, contact] : [contact]);
}

export function removeContactFromTag(id: string, contactId: string) {
	setState("tags", (t) => t.id === id, "contacts", (c) => c.filter(c => c.identifier !== contactId));
}

export function setPage(page: number) {
	setState("page", page);
}