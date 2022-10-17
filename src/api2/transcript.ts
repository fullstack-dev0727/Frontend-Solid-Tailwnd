type Response = {
	value: string
	begin: number
	end: number
	score: number
}[]

export function transcript(
	id: string,
	overwrite?: string,
	onProgress?: (stage: string, step: number, total: number) => void
): Promise<Response> {
	const params = new URLSearchParams({
		id,
	})

	if (overwrite) {
		params.set("with_transcript", "true")
	}

	const env =
		import.meta.env.MODE == "stage"
			? ".stage"
			: import.meta.env.MODE == "dev"
			? ".dev"
			: ""

	return new Promise((resolve, reject) => {
		const ws = new WebSocket(
			`wss://transcript-ws${env}.bhuman.ai/transcripts/ws?${params}`
		)
		ws.onopen = () => {
			console.log("ws open", overwrite)
			if (overwrite) ws.send(overwrite.replace(/\s+/g, "|"))
		}
		ws.onerror = (e) => {
			console.log("ws error", e)
			reject(e)
		}
		ws.onmessage = (e) => {
			console.log("ws", e.data)
			const { kind, data } = JSON.parse(e.data)
			const [op, stage] = kind.split(":")
			if (op === "progress") {
				onProgress(stage, data[0], data[1])
			} else if (op === "done") {
				resolve(data)
			} else if (op === "error") {
				reject({
					error: data[1],
					details: data[2],
				})
			}
		}
	})
}
