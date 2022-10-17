import { onMount, createSignal, Show, createEffect, For } from "solid-js"
import MichaelImg from "@/assets/images/Michael_lulo_image_40X40.png"
import { LoadingIcon } from "@/assets/icons"
import { ProgressBar } from "@/ui/ProgressBar"
import { Plan, checkout } from "@/api2/userPlan"
import {
	state,
	fetchSettingsState,
	PLAN_INFO,
	getSortedPlanArray,
} from "./state"

const generateBody = ({ plan_id }: { plan_id: string }) => ({
	plan_id,
	success_url: `${window.location.origin}/success=true/${plan_id}`,
	cancel_url: `${window.location.origin}/success=false/${plan_id}`,
	// success_url: `${window.location.origin}/success=true/${
	// 	state?.Plans?.find((plan) => plan.id === plan_id).soft_limit
	// }`,
	// cancel_url: `${window.location.origin}/success=false/${
	// 	state?.Plans?.find((plan) => plan.id === plan_id).soft_limit
	// }`,
	validator: true,
})

const handleUpdatePlan = async (plan_id: string) => {
	if (!plan_id) return
	const checkoutResp = await checkout(
		generateBody({
			plan_id,
		})
	)
	//@ts-ignore
	location.href = checkoutResp?.result?.url
}

const PriceButton = (props: {
	variant: "current" | "upgrade"
	plan_id: string
}) => {
	const [isLoading, setLoadingState] = createSignal(false)

	if (props.variant === "current") {
		return (
			<button class="py-5 px-9 flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded-full w-full">
				<span class="text-lg leading-none">Current</span>
			</button>
		)
	}
	return (
		<button
			onClick={async () => {
				// TODO: HANDLE ERRORS
				setLoadingState(true)
				await handleUpdatePlan(props.plan_id)
				setLoadingState(false)
			}}
			class="py-5 px-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 rounded-full w-full"
		>
			<Show
				when={!isLoading()}
				fallback={<LoadingIcon class="w-5 h-5 text-white" />}
			>
				<span class="text-lg leading-none text-white">Upgrade</span>
			</Show>
		</button>
	)
}

export const AIStudio = () => {
	let [loading, setLoading] = createSignal(false)
	let [progress, setProgress] = createSignal(0)
	let [plans, setPlans] = createSignal<Partial<Plan[]>>(null)
	let [activePlan, setActivePlan] = createSignal<Plan>(null)
	let [isFreePlan, setIsFreePlan] = createSignal(true)

	const init = () => {
		setLoading(true)
		setPlans(getSortedPlanArray())
		if (state?.userPlan) setActivePlan(state?.userPlan)
		if (state?.userPlan?.name !== "Free plan") setIsFreePlan(false)
		console.log("activePlan", activePlan())
		setLoading(false)
	}

	onMount(async () => {
		setLoading(true)
		if (!state?.Plans || !state?.userPlan) fetchSettingsState().then(init)
		else init()
	})

	createEffect(() => {
		if (!loading() && activePlan()) {
			if (
				(state.userQuota?.generated_videos_used === 0 &&
					activePlan()?.soft_limit === 0) ||
				state.userQuota?.generated_videos_used === activePlan()?.soft_limit
			)
				setProgress(100)
			else
				setProgress(
					Math.floor(
						(state.userQuota?.generated_videos_used /
							(activePlan()?.soft_limit === 0
								? state.userQuota?.generated_videos_used
								: activePlan()?.soft_limit)) *
							100
					)
				)
		} else {
			setProgress(0)
		}
	})

	const PlanContainer = (props: { plan: Plan }) => {
		// @ts-ignore
		const plan_info = PLAN_INFO[`${props.plan.name.replaceAll(" ", "_")}`]
			? // @ts-ignore
			  PLAN_INFO[`${props.plan.name.replaceAll(" ", "_")}`]
			: PLAN_INFO.DEFAULT
		return (
			<div
				class="flex flex-col items-center"
				classList={{
					"w-screen h-72": loading(),
				}}
			>
				<div
					class="flex flex-col py-5 px-4 max-w-[248px] bg-slate-100 rounded-lg"
					classList={{
						"w-full h-full content-center justify-center items-center":
							loading(),
					}}
				>
					<Show
						when={!loading()}
						fallback={<LoadingIcon class="w-5 h-5 text-white" />}
					>
						<div class="flex flex-col mb-4">
							<h2 class="text-xl font-bold">{props.plan.name}</h2>
							<p class="text-slate-500 font-medium">{plan_info}</p>
						</div>
						<ul class="list-disc list-inside mb-6">
							<li class="font-bold uppercase">
								{props.plan.soft_limit} videos a month
							</li>
							<li class="font-bold uppercase">
								{props.plan.extra_videos_cost.slice(0, -2)}$ per extra video
							</li>
						</ul>
						<div class="inline-flex items-end border-t-2 border-slate-200 gap-x-1 mb-7 pt-0.5">
							<p class="text-3xl font-bold">{props.plan.price}$</p>{" "}
							<span class="inline pb-1 font-semibold">/month</span>
						</div>
						<div>
							<PriceButton
								plan_id={props.plan.id}
								variant={
									state?.userPlan?.name === props.plan.name
										? "current"
										: "upgrade"
								}
							/>
						</div>
					</Show>
				</div>
			</div>
		)
	}

	return (
		<section class="p-8 grow flex flex-col">
			<div class="flex flex-col gap-y-8 mb-4">
				<div class="flex flex-col gap-y-2">
					<h1 class="text-2xl font-semibold pl-1.5">Usage</h1>
					<Show
						when={!loading()}
						fallback={<LoadingIcon class="w-5 h-5 ml-4" />}
					>
						<div class="flex items-center">
							<ProgressBar.CircularProgressbar
								radius={36}
								progress={progress}
								strokeWidth={7}
								trackStrokeWidth={7.1}
								strokeLinecap="round"
								strokeColor="#4EADF1"
								trackStrokeColor="#F0F0F0"
							>
								<div
									class="flex items-center justify-center text-center absolute
                                top-0
                                w-full h-full
								mx-auto
								my-0
								text-slate-800 select-none font-semibold"
								>
									<div>{progress() === NaN ? "0" : progress()}%</div>
								</div>
							</ProgressBar.CircularProgressbar>
							<div class="flex flex-col items-start pb-2">
								<h2 class="font-semibold leading-4 mb-1.5">
									{" "}
									{state?.userPlan?.name !== undefined
										? state?.userPlan?.name
										: "Free"}{" "}
									Tier{" "}
								</h2>
								<p class="text-[13px] font-medium mb-2">
									{state.userQuota?.generated_videos_used} of{" "}
									{activePlan()?.soft_limit} used
								</p>
								<ProgressBar.FlatProgressBar
									completed={progress()}
									borderRadius="10px"
									bgColor="#4EADF1"
									height="6px"
									width="340px"
									isLabelVisible={false}
									labelColor="#e80909"
								/>
							</div>
						</div>
					</Show>
				</div>
			</div>
			<div class="flex flex-col">
				<h2 class="text-xl font-extrabold">Plans</h2>
				<main
					class="grid grid-cols-3 gap-4 p-4 mb-11"
					classList={{
						"place-items-start": loading(),
						"place-items-center": !loading(),
					}}
				>
					<Show
						when={plans()}
						fallback={<LoadingIcon class="w-5 h-5" />}
					>
						<For each={plans()}>
							{(plan) =>
								plan.name !== "Free plan" ? <PlanContainer plan={plan} /> : null
							}
						</For>
					</Show>
				</main>
				<Show when={!isFreePlan()}>
					<div class="flex justify-center text-lg w-full items-center mb-2">
						<span class="text-slate-500">
							Want to downgrade to the free plan (15 videos / month)?
						</span>
						<a
							// href=""
							class="inline-block px-1 underline text-blue-500"
							onClick={() => {
								const id = plans()?.find((plan) => plan.name === "Free plan").id
									? plans()?.find((plan) => plan.name === "Free plan").id
									: ""
								handleUpdatePlan(id)
							}}
						>
							Click here
						</a>
					</div>
				</Show>
				<div class="flex justify-center text-lg w-full items-center">
					<img
						src={MichaelImg}
						alt="our VP photo"
						class="w-10 mr-2 h-10 rounded-full"
					/>
					<span class="text-slate-600">Looking for enterprise?</span>
					<span class="text-slate-500">
						Please email Michael lulo, our VP of Sales, at
					</span>
					<a
						href=""
						class="inline-block px-1 underline text-blue-500"
					>
						Michael@BHuman.ai
					</a>
				</div>
			</div>
		</section>
	)
}

export default AIStudio
