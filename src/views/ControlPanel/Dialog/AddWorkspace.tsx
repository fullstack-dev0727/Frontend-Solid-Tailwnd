import axiosApi from "@/api"
import { CheckIcon, StopIcon, XIcon } from "@/assets/icons"
import { useSolidMediaRecorder } from "@/helpers/mediaRecorder"
import { easings } from "@/ui/helpers/easings"

import {
	AudioMicrophoneButton,
	MicrophoneIconButton,
	RecordIconButton,
	StopIconButton,
	TickIconButton,
	XIconButton,
} from "@/ui/IconButtons"
import { createFormActions, Errors } from "solid-form-action"

import {
	createEffect,
	createReaction,
	createSignal,
	onMount,
	Setter,
	Show,
} from "solid-js"

const addWorkspace = async ({
	name,
	generated_videos_quota,
}: {
	name: string
	generated_videos_quota: number
}) => await axiosApi.post(`workspace`, { name, generated_videos_quota })

export const AddWorkspaceDialog = (props: { closeEvent: any }) => {
	const [isUploading, setUploadingState] = createSignal(false)

	const registerWorkspace = async (values: {
		name: string
		generated_videos_quota: number
	}) => {
		try {
			setUploadingState(true)
			const res = await addWorkspace(values)
		} catch (e) {
			localStorage.clear()
			console.log(e)
		} finally {
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
			await addWorkspace({
				name: values.workspace_name,
				generated_videos_quota: 200,
			})
		},
	})

	let overlayRef: HTMLDivElement
	let panelRef: HTMLDivElement
	let statusRef: HTMLDivElement
	let videoContainerRef: HTMLElement
	let bottomControllerRef: HTMLDivElement

	const onFinish = (Animation: Animation) => {
		Animation.onfinish = () => {
			Animation.commitStyles()
			Animation.cancel()
		}
	}
	let animDur = 400
	onMount(() => {
		const overlayAnimation = overlayRef.animate(
			{
				opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: animDur,
				fill: "both",
				easing: easings["in-40"],
			}
		)
		onFinish(overlayAnimation)
		const panelAnimation = panelRef.animate(
			{
				// opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: animDur,
				fill: "both",
				easing: easings["in-30"],
			}
		)
		onFinish(panelAnimation)
		const statusAnimation = statusRef.animate(
			{
				transform: ["translateY(20px)", "translateY(0px)"],
				opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: animDur,
				fill: "both",
				easing: easings["elastic-30"],
			}
		)
		onFinish(statusAnimation)
		const videoContainerAnimation = videoContainerRef.animate(
			{
				transform: ["scale(1.08)", "scale(1)"],
				opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: animDur,
				fill: "both",
				easing: easings["elastic-20"],
			}
		)
		onFinish(videoContainerAnimation)
		const bottomControllerAnimation = bottomControllerRef.animate(
			{
				transform: [
					"translateY(-30px) scale(1.08)",
					"translateY(0px) scale(1)",
				],
				opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: animDur,
				easing: easings["elastic-10"],
				fill: "both",
			}
		)
		onFinish(bottomControllerAnimation)
	})
	const onExit = () => {
		const overlayAnimation = overlayRef.animate(
			{
				opacity: [1, 0],
				// background:['#FFF','#000'],
			},
			{
				duration: 1000,
				fill: "both",
				easing: easings["in-out-20"],
			}
		)
		overlayAnimation.onfinish = () => overlayAnimation.cancel()
		const panelAnimation = panelRef.animate(
			{
				// opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: 1000,
				fill: "both",
				easing: easings["in-out-10"],
			}
		)
		panelAnimation.onfinish = () => panelAnimation.cancel()
		const statusAnimation = statusRef.animate(
			{
				transform: ["translateY(0px)", "translateY(20px)"],
				opacity: [1, 0.1, 0],
			},
			{
				duration: 1000,
				fill: "both",
				easing: easings["swift"],
			}
		)
		statusAnimation.onfinish = () => statusAnimation.cancel()
		const videoContainerAnimation = videoContainerRef.animate(
			{
				transform: ["translateY(0px) scale(1)", "translateY(56%) scale(0)"],
				opacity: [1, 0.45, 0],
			},
			{
				duration: 1000,
				fill: "both",
				easing: easings["squish-20"],
			}
		)
		videoContainerAnimation.onfinish = () => videoContainerAnimation.cancel()
		const bottomControllerAnimation = bottomControllerRef.animate(
			{
				transform: ["translateY(0px) scale(1)", "translateY(30px) scale(0)"],
				opacity: [1, 0],
			},
			{
				duration: 1000,
				fill: "both",
				easing: easings["squish-50"],
			}
		)
		bottomControllerAnimation.onfinish = () =>
			bottomControllerAnimation.cancel()
	}
	return (
		<section
			role="dialog"
			aria-modal="true"
			id="modal-title"
			aria-labelledby="modal-title"
			class="overflow-y-auto fixed inset-0 z-50"
		>
			{/* <!-- Overlay --> */}
			<div
				// x-show="isOpen"
				ref={(el: HTMLDivElement) => (overlayRef = el)}
				// x-transition.opacity.duration.500ms
				class="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
			></div>
			{/* <!-- Panel --> */}
			<div
				ref={(el: HTMLDivElement) => (panelRef = el)}
				class="flex relative flex-col justify-center  min-h-screen max-h-screen px-12"
			>
				<main
					// x-on:click.stop
					// x-trap.noscroll.inert="isOpen"
					ref={(el: HTMLElement) => (videoContainerRef = el)}
					id="dialog-container"
					class="
					p-3
							bg-white/10
							shadow-2xl
							shadow-[rgba(96,165,250,0.05)]
							backdrop-blur-xl
							rounded-2xl
							flex flex-col items-start justify-center
						"
				>
					{/* <div class="flex flex-col items-start gap-y-1 mb-6">
						<div className="mt-2">
							<h1 class="text-slate-400 text-3xl">Add a New Workspace</h1>
						</div>
						<div class="flex items-center">
							<h4 class="text-xl text-slate-600 whitespace-normal font-normal">
								to access hailey
							</h4>
						</div>
					</div> */}
					<form use:form>
						<div class="rounded-md shadow-sm -space-y-px">
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
								class="appearance-none bg-lime-50 rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								ref={workspace_name}
								value={formState.workspace_name}
								placeholder="Workspace Name"
							/>
							{errors.workspace_name && (
								<span class="ml-2 text-red-700">{errors.workspace_name}</span>
							)}
						</div>
					</form>
				</main>
				<div class="flex my-4 w-full items-start">
					<button
						class="group text-8xl relative w-max flex justify-center pt-2 pb-4 px-4 border border-transparent font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						type="submit"
					>
						Submit
					</button>
				</div>
			</div>
		</section>
	)
}
