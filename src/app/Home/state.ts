import { createStore } from "solid-js/store"

export const [state, setState] = createStore<{
	isNewUser: boolean
}>({
	isNewUser: !!localStorage.getItem("is_new_user"),
})

export function setIsNewUser(value: boolean) {
	setState("isNewUser", value)
}

export const isNewUser = () => state.isNewUser
