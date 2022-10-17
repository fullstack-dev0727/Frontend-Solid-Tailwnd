import { createSignal, Show } from "solid-js"
import { LoadingIcon } from "@/assets/icons"
import { APIKeyPair, generateKeyPairs } from "@/api2/keygen"
import { InputWithCopy } from "@/ui/InputWithCopy"

export const Zapier = () => {
	const [loading, setLoading] = createSignal(false)
	const [keyPair, setKeyPair] = createSignal<APIKeyPair>(null)

	const handleGenerateClick = async () => {
		setLoading(true)
		try {
			const res = await generateKeyPairs()

			if (res.code === 200) {
				setKeyPair(res.result)
				console.log(res.result)
			}
		} catch (error) {
			console.log(error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<section class="p-8 grow flex flex-col gap-y-8">
			<ZapierCard />
			<div>
				<h2 class="text-xl font-bold">API Key</h2>
				<div class="flex flex-col mt-4 mb-6 gap-y-3 max-w-xl">
					<div class="w-full justify-between items-center flex">
						<label
							for="client_id"
							class="font-medium"
						>
							CLIENT ID:
						</label>
						<InputWithCopy
							value={keyPair()?.client_id}
							name="client_id"
						/>
						{/* <input
							type="text"
							class="bg-gray-200 rounded-xl w-full max-w-md  h-10 px-3"
							value={keyPair()?.client_id}
							name="client_id"
							readonly
						/> */}
					</div>
					<div class="w-full justify-between items-center flex">
						<label
							for="client_secret"
							class="font-medium"
						>
							CLIENT Secret:
						</label>

						<InputWithCopy
							value={keyPair()?.client_secret}
							name="client_secret"
						/>
					</div>

					<div class="w-full justify-end items-center flex gap-x-5 mt-5">
						<button
							class="disabled:cursor-progress bg-blue-400 hover:bg-blue-500 transition-colors duration-100 ease-in-out cursor-pointer rounded-xl px-3 py-1.5 font-medium text-white w-52 flex justify-center items-center h-9"
							onClick={handleGenerateClick}
							disabled={loading()}
						>
							<Show
								when={!loading()}
								fallback={
									<LoadingIcon
										class="animate-spin"
										size={16}
									/>
								}
							>
								Generate New API Key
							</Show>
						</button>
					</div>
				</div>
			</div>
		</section>
	)
}

const ZapierCard = () => {
	return (
		<div class="w-full max-w-xl rounded-2xl bg-gradient-to-br from-[#fe5e0eb4] to-[#FE5D0E] overflow-clip mb-4 relative">
			<img src="/zapier-card.png" />

			<div class="flex w-full absolute z-10 bottom-8 justify-end px-5">
				<a
					href="https://zapier.com/developer/public-invite/166126/95283fbc0184c4fed97abe43665b65f5/"
					class="flex items-center justify-center gap-x-2 w-52 bg-white hover:translate--1 hover:-translate-y-1 transition-transform duration-100 ease-in-out-10 px-3 py-2 rounded-xl "
					target="_blank"
				>
					<img
						src="/zapier.png"
						alt="zapier logo"
						width={20}
						height={20}
					/>
					<span class="font-medium">Get Our Integration!</span>
				</a>
			</div>
		</div>
	)
}

export default Zapier
