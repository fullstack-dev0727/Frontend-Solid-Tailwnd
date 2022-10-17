import { getCurrentContact } from "./state"

export const Contact = () => {
	return (
		<div class="flex flex-col items-center pt-[30%] h-full bg-white z-[100]">
			{getCurrentContact() ? <div class="flex flex-col items-center justify-center gap-4">
				{getCurrentContact().photo && <img class="rounded-full bg-gray-600" src={getCurrentContact().photo} referrerpolicy="no-referrer" />}
				<p>{getCurrentContact().name}</p>
				<p>{getCurrentContact().phone_numbers[0] || "N/A"}</p>
			</div> : <p>Choose a contact!</p>}
		</div>
	)
}
