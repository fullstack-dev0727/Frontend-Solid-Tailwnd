import { RouteDefinition } from "solid-app-router"
import { ContactInfo as ContactInfoAuto } from "@/api2/addressbook"

export type UserInfo = {
	id: string
	email: string
	fullname: string
	username: string
	stytch_user_id: string
	updated_at: string
	created_at: string
	generated_videos_quota: number
	generated_videos_used: number
	not_binded_videos: number
	org_id: string
	plan_id: string
	stripe_customer_id: string
	stripe_metred_subscription_item_id: null
	stripe_subscription_id: string
	stripe_subscription_item_id: string
}

export type AppInfo = {
	id: string
	name: string
	theme: string
	icon: string
	main: boolean
	notifications: number
	bottom: boolean
	class?: string
}

export type RouteInfo = RouteDefinition & {
	// Path to the welcome video
	welcomeVideo?: string
	notApp?: boolean
}

export type State = {
	currentApp: string
	apps: AppInfo[]
}

export type ContactInfo = ContactInfoAuto
