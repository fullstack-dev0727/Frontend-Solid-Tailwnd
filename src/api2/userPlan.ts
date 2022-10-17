import { json, get, Result, post, del } from "./ops"

export interface Plan {
	created_at: string
	extra_videos_cost?: string
	id: string
	is_free?: boolean
	is_metred_plan: boolean
	metred_stripe_plan_id: null | string
	name: "Free plan" | "Growth" | "Scale" | "Ultimate"
	price: string
	quota: number
	soft_limit?: number
	stripe_plan_id: null | string
	updated_at: string
}

export interface Checkout {
	cancel_url: string
	plan_id: string
	success_url: string
	validator: null | boolean | string
}

export interface Quota {
	id: string
	user_id: string
	stripe_customer_id?: string | null
	stripe_subscription_id?: string | null
	stripe_subscription_item_id?: string | null
	stripe_metred_subscription_item_id?: string | null
	plan_id: string
	generated_videos_quota: number
	generated_videos_used: number
	not_binded_videos: number
}

export function getUserPlan(id: string): Promise<Result<Plan[]>> {
	return json(get(`api/plan?id=${id}`, "https://user.dev.bhuman.ai/"))
}

export function getPlans(): Promise<Result<Plan[]>> {
	return json(get(`api/plan`, "https://user.dev.bhuman.ai/"))
}

export function cancelSubscription(): Promise<Result<void>> {
	return json(
		del("api/plan/cancel_subscription", "https://user.dev.bhuman.ai/")
	)
}

export function checkout(checkout: Partial<Checkout>) {
	return json(
		post("api/plan/checkout", checkout, "https://user.dev.bhuman.ai/")
	)
}

export function fetchCustomerPortalLink() {
	return json(
		post(
			"api/plan/customer_portal",
			{
				return_url: `${window.location.origin}/settings/billings`,
			},
			"https://user.dev.bhuman.ai/"
		)
	)
}

export function getUserQuota(): Promise<Result<Quota>> {
	return json(get(`api/user/quota`, "https://user.dev.bhuman.ai/"))
}
