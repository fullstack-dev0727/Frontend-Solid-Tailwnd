import { Renamable } from "@/ui/Form/Renamable"
import { Component } from "solid-js"

export const TableCell: Component<{ name: string }> = (props) => {
	return (
		<td class={`border p-2`}>
			<Renamable
				onRename={console.log}
				name={props.name}
			/>
		</td>
	)
}
