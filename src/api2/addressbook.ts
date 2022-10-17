import { del, get, json, post, query, Result } from "./ops"
import { repo } from "./repo"

export type ContactInfo = {
	email_addresses: string[],
	identifier: string,
	name: string,
	provider: string,
	phone_numbers: string[],
	photo?: string
}

export interface Tag {
	id: string,
	name: string,
	user_id: string
}

export interface TagGroup {
	contacts: ContactInfo[],
	tag_id: string,
	user_id: string
}

export function getContacts(data: {
	provider: string,
	query?: string,
	size?: number,
	page?: number
}) {
    const options: Record<string, string> = {
        page: (data.page || "0").toString(),
        provider: data.provider,
        size: (data.size || "10").toString()
    }
    if (data.query) options.query = data.query;
    return json<Result<{ 
		contacts: ContactInfo[],
		total: number
	 }>>(get(query("api/contacts", options),"https://contacts.dev.bhuman.ai/"));
}

export async function syncContacts(props: {
	email: string,
	token: string,
	provider: string,
	phone?: string
}) {
	await post("api/contacts", {...props, phone: props.phone || ""},"https://contacts.dev.bhuman.ai/");
}

export async function getHubspotContacts(data: {
	code: string,
	redirect_uri: string
}) {
	return await json<Result<{
		token: string
	}>>(post("api/auth/hubspot", data,"https://auth.dev.bhuman.ai/"))
}

export const tags = repo<
	{ name: string },
	undefined,
	{},
	{ name: string, id: string },
	{ id: string },
	Tag
>("api/contacts/tag","https://contacts.dev.bhuman.ai/");

export const deleteTag = (tag: string) => {
	return del(`api/contacts/tag?id=${tag}`,"https://contacts.dev.bhuman.ai/");
}

export const tagGroup = repo<
	{ identifier: string, tag_id: string },
	{ id: string },
	undefined,
	undefined,
	{ identifier: string, tag_id: string },
	TagGroup
>("api/contacts/group","https://contacts.dev.bhuman.ai/");