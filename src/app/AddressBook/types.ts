import { ContactInfo } from "@/types"


export type TagInfo = {
	id: string
	name: string,
	contacts?: ContactInfo[]
}

export type AddressBookState = {
	currentTag: string,
    currentContact?: string,
	contacts: ContactInfo[][],
	page: number,
	tags: TagInfo[],
	providers?: string[],
	currentProvider?: string
}
