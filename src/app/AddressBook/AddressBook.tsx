import { Component } from "solid-js"
import { SplitPane } from "@/ui/SplitPane"
import { Explorer } from "./Explorer"
import { Contact } from "./Contact"

export const AddressBook: Component = () => {
	return (
		<SplitPane
			upper={(t) => t - 400}
			lower={(t) => t - 700}
			left={<Explorer />}
			right={
				<Contact />
			}
		/>
	)
}

export default AddressBook
