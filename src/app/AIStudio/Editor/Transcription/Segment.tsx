import { Component, createEffect, createSignal, Match, Switch } from "solid-js"
import { addSegment, removeSegment, renameSegment, setState } from "../state"
import { SegmentData } from "../types"
import { ClockIcon } from "./ClockIcon"

const [inputFocused, setInputFocused] = createSignal(false)

export const Segment: Component<SegmentData & { flat?: boolean }> = (props) => {
	let input: HTMLInputElement
	const [newName, setNewName] = createSignal(props.name)

	const cleanName = () => newName().trim() || "Untitled"

	createEffect(() => {
		setNewName(props.name)
	})

	function update() {
		renameSegment(props.id, cleanName())
	}

	function create() {
		addSegment({ ...props, name: cleanName() })
	}

	const buttonClass = "text-[13px] leading-4 px-4 py-2 font-[500] rounded-full"

	return (
		<div
			class="whitespace-nowrap p-1 pr-2 pl-6 rounded-xl bg-white flex gap-2 items-center border-gray-300 border "
			classList={{
				"shadow-[0px_5px_48px_rgba(0,0,0,0.25)]": !props.flat,
			}}
		>
			<input
				ref={input}
				class="outline-none w-[150px] leading-5"
				value={props.name}
				placeholder="Label your variable"
				onBlur={() => {
					if (props.creating)
						setState("segments", (ss) => ss.filter((s) => !s.creating))
					setNewName(props.name)
					setInputFocused(false)
				}}
				onChange={() => {
					if (props.creating) create()
					else update()
					input.blur()
				}}
				onInput={(e) => {
					setNewName(e.currentTarget.value)
				}}
				onFocus={() => setInputFocused(true)}
				autofocus={props.creating}
			/>
			{/* <Renamable
				name={props.name}
				onRename={(name) => {
					if (props.creating) {
						props.name = name
					} else {
						renameSegment(props.id, name.trim() || "untitled")
					}
				}}
			/> */}
			<div class="text-[13px] leading-4 bg-[#BFF9B5] mt-0.5 px-1 text-[#1E5814] flex gap-1 p-0.5 items-center">
				<ClockIcon />
				{props.from.toFixed(2)} - {props.to.toFixed(2)}
			</div>
			{/* <button
				class="text-red-500 hover:text-red-600"
				onClick={() => removeSegment(props.id)}
			>
				<DeleteIcon class="w-4" />black
			</button> */}
			<Switch>
				<Match when={props.creating}>
					<button
						class={`text-white px-2 bg-[#187FE7] ${buttonClass}`}
						onClick={create}
					>
						Create
					</button>
				</Match>
				<Match when={props.name !== newName() && !props.creating}>
					<button
						class={`text-white px-2 bg-[#187FE7] ${buttonClass}`}
						onClick={update}
					>
						Update
					</button>
				</Match>
				<Match when={!props.creating}>
					<button
						class={`text-[#F40A0A] px-2 bg-[#E91E1E]/[.12] ${buttonClass}`}
						onClick={() => removeSegment(props.id)}
					>
						Delete
					</button>
				</Match>
			</Switch>
		</div>
	)
}
