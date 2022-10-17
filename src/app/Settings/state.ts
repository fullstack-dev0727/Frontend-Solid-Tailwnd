import { createStore } from "solid-js/store"
import {
	getUserPlan,
	getPlans,
	Plan,
	getUserQuota,
	Quota,
} from "@/api2/userPlan"
import { User, read, update } from "@/api2/user"

export type SettingsState = {
	user?: User
	userPlan?: Plan
	Plans: Plan[]
	userQuota: Quota
	loading: boolean
}

// IF NEW PLAN INFO NEEDED -- ADD INFO HERE WITH CASE SENSITIVE TYPED PLAN NAME; Otherwise: DEFAULT used
export enum PLAN_INFO {
	Free_plan = "Free Plan",
	Growth = "Get started with an affordable plan",
	Scale = "For businesses that need higher volume",
	Ultimate = "For high volume power users, get the best price",
	DEFAULT = "Get started with an affordable plan",
}

export const [state, setState] = createStore<SettingsState>({
	user: null,
	userPlan: null,
	Plans: null,
	loading: false,
	userQuota: null,
})

export const setUser = (user: User) => {
	setState("user", user)
}

export const setPlan = (plan: Plan) => {
	setState("userPlan", plan)
}

export const setQuota = (quota: Quota) => {
	setState("userQuota", quota)
}

export const setAllPlans = (plans: Plan[]) => {
	setState("Plans", plans)
}

export const fetchSettingsState = async (fetch_only_user?: boolean) => {
	setState("loading", true)
	console.log("Settings state updating...")

	// GET USER
	const userResp = await read()
	if (userResp.result) setUser(userResp.result)

	if (!fetch_only_user) {
		// GET USER PLAN
		const planResp = await getUserPlan(state.user?.plan_id)
		if (planResp.result && planResp.result[0]) setPlan(planResp.result[0])

		// GET USER QUOTA
		const quotaResp = await getUserQuota()
		if (quotaResp.result) setQuota(quotaResp.result)

		// GET ALL PLANS
		// OPTIONAL - TODO: Get all plans, index by plan_id, set user plan by plan_id
		const allPlansResp = await getPlans()
		if (allPlansResp.result) setAllPlans(allPlansResp.result)
	}
	console.log("Settings state: ", state)
	setState("loading", false)
	return state
}

export const updateUser = async (values: { key: string; value: any }[]) => {
	let _user = { ...state.user }
	for (const { key, value } of values) {
		_user = { ...state.user, [`${key}`]: value }
	}
	await update(_user)
	setUser(_user)
	console.log("User updated: ", _user)
}

export const getUserFullName = () => {
	return `${state?.user?.first_name ? state?.user?.first_name : ""}${
		state?.user?.last_name ? ` ${state?.user?.last_name}` : ""
	}`
}

export const getUserValue = (key: string): any => {
	//@ts-ignore
	return state?.user[`${key}`] ? state?.user[`${key}`] : null
}

// Sort Plan Array by PLAN_INFO name order
export const getSortedPlanArray = (): Plan[] => {
	let sorted: Plan[] = []
	if (!state.Plans || state.Plans.length === 0) return sorted
	for (const key of Object.keys(PLAN_INFO)) {
		const plan = state.Plans.find(
			(plan) => plan.name.replaceAll(" ", "_") === key
		)
		plan && sorted.push(plan)
	}
	return sorted
}
