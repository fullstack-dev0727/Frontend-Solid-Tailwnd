import { auth } from "./api2"

function ask(message: string) {
	let res = ""
	while (!res) {
		res = prompt(message)
	}
	return res
}

export async function devLogin() {
	console.log("RUNNING DEV LOGIN")

	localStorage.clear()

	if (localStorage.getItem("access_token")) return
	const email=ask("Email: ")
	const {
		code: status,
		result: { method_id },
	} = await auth.authEmail(email)
	console.log(method_id)
	if (status !== 200) return alert("Something went wrong: success=false")
	const code = ask("Email code")
	const {
		result: {
			token: { access_token, refresh_token },
			user_id,
		},
	} = await auth.verifyEmail(code, method_id)
	localStorage.setItem("access_token", access_token)
	localStorage.setItem("refresh_token", refresh_token)
	localStorage.setItem("user_id", user_id)
	localStorage.setItem("email", email)
	location.reload()
}
