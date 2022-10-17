import {json, post} from "./ops";


export function create(data: {
    sender: { first_name: string, last_name?: string },
    receivers: Array<{
        email?: string,
        phone?: string,
        first_name: string,
        last_name?: string
    }>
}) {
    return json(post("api/invite", data,"https://invite.dev.bhuman.ai/"));
}