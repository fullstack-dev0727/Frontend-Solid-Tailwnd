

import { App } from "@/ui/AppNavigator";
import { Component } from "solid-js"
import { Explorer } from "./Explorer";

export const LeadR: Component = () => {
	return <App name="lead-r">
		<Explorer />
	</App>
}

export default LeadR;