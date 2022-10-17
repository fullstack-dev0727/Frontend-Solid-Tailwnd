import { createStore } from "solid-js/store"

export interface LeadRState {
	selectedInbox?: number,
	selectedNavigation?: number,
	inboxes: Array<{name: string}>
}

export const [state, setState] = createStore<LeadRState>({
	selectedInbox: undefined,
	selectedNavigation: undefined,
	inboxes: [
		{
			name: "Group 1"
		},
		{
			name: "Group 2"
		},
		{
			name: "Group 3"
		},
		{
			name: "Something else"
		}
	]
});

export function setCurrentInbox(id: number) {
	setState("selectedInbox", id);
}


export function setSelectedNavigation(id: number) {
	setState("selectedNavigation", id);
}