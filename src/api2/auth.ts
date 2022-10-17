import { get, json, post, Result } from "./ops"

export type AuthEmailResult = Result<{
	method_id: string
	user_created: boolean
	user_id: string
}>

export type VerifyEmailResult = Result<{
	token: {
		access_token: string
		refresh_token: string
	}
	user_id: string
}>

export type VerifyAuth = {
	id_token: string
	token: {
		access_token: string
		refresh_token: string
	}
	user: {
		created_at: string
		crypto_wallets: string[]
		emails: string[]
		name: { first_name: string, last_name: string, middle_name: string }
		password: string
		phone_numbers: string[]
		providers: string[]
		status: string
		totps: string[]
		user_id: string
		webauthn_registrations: string[]
	}
	user_id: string
}

export async function authEmail(email: string): Promise<AuthEmailResult> {
	return await json<AuthEmailResult>(post("api/auth/email", { email }, "https://auth.dev.bhuman.ai/"))
}

export async function verifyEmail(
	code: string,
	method_id: string
): Promise<VerifyEmailResult> {
	return await json(post("api/verify/email", { method_id, code }, "https://auth.dev.bhuman.ai/"))
}

export async function getProvider(): Promise<{ result: string[] }> {
	return await json(get("api/auth/providers", "https://auth.dev.bhuman.ai/"))
}

export async function verifyAuth(data: { token: string, user_id?: string }) {
	return await json<Result<VerifyAuth>>(post("api/verify/oauth", data, "https://auth.dev.bhuman.ai/"))
}