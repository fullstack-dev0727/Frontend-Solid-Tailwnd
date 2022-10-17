import { json, get, query, post, put, jsonFetch, Result } from "./ops"

export function repo<
	C,
	R extends Record<string, string>,
	L extends Record<string, string>,
	U,
	D,
	T
>(endpoint: string, root?: string) {
	return {
		create(data: C) {
			return json<Result<T>>(post(endpoint, data, root))
		},
		async read(q: R) {
			const { result, code } = await json<Result<T[]>>(get(query(endpoint, q), root));
			if (Array.isArray(result)) return { code, result: result[0] };
			return { code, result }
		},
		list(q: L) {
			return json<Result<T[]>>(get(query(endpoint, q), root))
		},
		update(data: U) {
			return json<Result<T>>(put(endpoint, data, root))
		},
		delete(data: D) {
			return json<Result<void>>(jsonFetch("DELETE", endpoint, data, root))
		},
	} as const
}
