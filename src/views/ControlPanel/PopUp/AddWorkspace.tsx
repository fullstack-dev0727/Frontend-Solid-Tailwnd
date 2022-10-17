import axiosApi from "@/api"
import { LoadingIcon, PlusCircleIcon } from "@/assets/icons"
import { PopUp } from "@/ui/Buttons/SplitButton"
import { createFormActions, Errors } from "solid-form-action"
import { createSignal, Show } from "solid-js"

const addWorkspace = async ({
	name,
	generated_videos_quota,
}: {
	name: string
	generated_videos_quota: number
}) => await axiosApi.post(`workspace`, { name, generated_videos_quota })

export const AddWorkspacePopUp = (props: { onLoadEnd: () => any }) => {
	const [isUploading, setUploadingState] = createSignal(false)

	const registerWorkspace = async (values: {
		name: string
		generated_videos_quota: number
	}) => {
		try {
			setUploadingState(true)
			console.log(`Details sended to workspace,`, values)
			const res = await axiosApi.post(`workspace`, {
				name: values.name,
				generated_videos_quota: 200,
			})
			console.log(`Workspace ADDED, `, res)
		} catch (e) {
			console.log(e)
		} finally {
			props?.onLoadEnd !== undefined ? props?.onLoadEnd() : null
			setUploadingState(false)
		}
	}

	const {
		actions: { workspace_name },
		form,
		formState,
		errors,
	} = createFormActions({
		initialValues: {
			workspace_name: "",
		},
		validate: (values) => {
			const errs: Errors<typeof values> = {}
			if (values.workspace_name.length === 0) {
				errs.workspace_name = "Fullname is required"
			}
			return errs
		},
		onSubmit: async (values) => {
			await registerWorkspace({
				name: values.workspace_name,
				generated_videos_quota: 200,
			})
		},
	})
	return (
		<PopUp.Container
			onClick={(event) => {
				if (event.target.nodeName !== "BUTTON") return
				console.info(event.currentTarget.innerText)
			}}
			class={`
				  group relative inline-flex items-center justify-center rounded-full  
						  w-9 h-9
						  sm:w-12 sm:h-12
						  md:w-20 md:h-20
						  lg:w-24 lg:h-24 
						  xl:w-32 xl:h-32
							md:translate-y-1
							lg:translate-y-1
							xl:translate-y-2
				  cursor-pointer 
          text-cyan-600
			    bg-transparent hover:bg-cyan-300 focus-within:bg-cyan-900 
			  hover:text-cyan-600 focus-within:text-cyan-200
				  focus:outline-none z-10
						`}
		>
			<PopUp.Indicator>
				<Show
					when={isUploading()}
					fallback={
						<PlusCircleIcon
							basic
							class={`
						  w-9 h-9
							box-content
						  sm:w-12 sm:h-12
						  md:w-20 md:h-20
						  lg:w-24 lg:h-24 
						  xl:w-32 xl:h-32
						`}
						/>
					}
				>
					<LoadingIcon
						class={`
              drop-shadow
						  w-9 h-9
							box-content
						  sm:w-12 sm:h-12
						  md:w-20 md:h-20
						  lg:w-24 lg:h-24 
						  xl:w-32 xl:h-32
          `}
					/>
				</Show>
			</PopUp.Indicator>
			<div
				class={`pointer-events-none absolute 
				        top-[18%]
				        flex list-none flex-col overflow-hidden 
				        rounded-md p-2
				        bg-transparent text-sm text-slate-900
				        transition-opacity opacity-0 group-focus-within:opacity-100 duration-200
				        focus:outline-none 
				        group-focus-within:pointer-events-auto 
				        group-focus-within:translate-y-0 
							`}
			>
				{/* <div class="w-64 h-20"> */}
				<Show
					when={isUploading()}
					fallback={
						<form
							use:form
							class="flex flex-col items-start gap-y-2"
						>
							<div class="rounded-md shadow-sm">
								<label
									for="initial-workspace-name"
									class="sr-only"
								>
									Initial Workspace Name
								</label>
								<input
									id="workspace_name"
									name="workspace_name"
									type="text"
									// autocomplete="email"
									autocomplete="off"
									required
									class="appearance-none bg-white rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
									ref={workspace_name}
									value={formState.workspace_name}
									placeholder="Workspace Name"
								/>
								{errors.workspace_name && (
									<span class="ml-2 text-red-700">{`${errors?.workspace_name}`}</span>
								)}
							</div>
							<div class="flex w-full justify-center">
								<button
									class="group relative w-max flex justify-center py-2 px-4 border-2 border-white font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:border-0 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									type="submit"
								>
									Add
								</button>
							</div>
						</form>
					}
				>
					<></>
				</Show>
				{/* </div> */}
			</div>
			{/* <div class="absolute border-8 top-[92%] -translate-y-4 right-[2.5ch] border-slate-500 border-r-transparent border-l-transparent border-t-transparent"></div> */}
		</PopUp.Container>
	)
}
