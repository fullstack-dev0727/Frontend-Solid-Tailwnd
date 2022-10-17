import { RouteInfo } from "@/types"
import { lazy } from "solid-js"

export const AddressBookRoute: RouteInfo = {
	path: "/address-book/",
	//welcomeVideo: "./videos/address-book",
	component: lazy(() => import("./AddressBook")),
	children: [
		{
			path: "/",
			component: lazy(() => import("./ContactList/AllContacts"))
		},
		{
			path: "/tag/:id",
			component: lazy(() => import("./ContactList/TagContacts"))
		}
	]
}
