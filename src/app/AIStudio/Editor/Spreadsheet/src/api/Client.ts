import { ClientMessage, ServerMessage } from "./types"

export class Client {
	private socket!: WebSocket
	public id = 0

	public onopen = () => {}

	constructor(
		url: string,
		name: string,
		pfp: string,
		hue: number,
		public handlers: {
			[key in keyof ServerMessage]: (message: ServerMessage[key]) => void
		}
	) {
		this.connect(url, name, pfp, hue)
	}

	private connect(url: string, name: string, pfp: string, hue: number) {
		this.socket = new WebSocket(url)

		this.socket.onopen = () => {
			this.onopen()
			this.send("ClientInfo", {
				name: JSON.stringify({ name, pfp }),
				user_id: localStorage.getItem("user_id"),
				hue,
			})
		}

		this.socket.onmessage = (e) => {
			console.log(e.data)
			for (const [type, message] of Object.entries(JSON.parse(e.data))) {
				// @ts-ignore - works if server returns correct types
				if (message.id === this.id) continue
				// @ts-ignore - works if server returns correct types
				this.handlers[type](message)
			}
		}

		this.socket.onclose = () => {
			console.log(
				"Disconnected from server, reconnecting in around 5 seconds..."
			)
			setTimeout(() => {
				this.connect(url, name, pfp, hue)
			}, 4000 + Math.random() * 2000) // reconnect after 4-6 seconds
		}

		this.socket.onerror = (e) => {
			console.log("Error", e)
		}
	}

	public send<T extends keyof ClientMessage>(
		type: T,
		message: ClientMessage[T]
	) {
		console.log(`Sending ${type}`, message)
		this.socket.send(JSON.stringify({ [type]: message }))
	}
}
