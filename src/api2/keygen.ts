import { json, post, Result } from "./ops"

export interface APIKeyPair {
	client_id: string
	client_secret: string
}

export function generateKeyPairs(): Promise<Result<APIKeyPair>> {
	return json(
		post(`api/keygen/generate_keypairs`, {}, "https://keygen.dev.bhuman.ai/")
	)
}
